// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//////////////////////////////////////////////////////////////////
// @title   Olive Protocol
// @notice  More at: https://useolive.space
// @version 1.2.0.KOMODO
// @author  Folktizen Labs
//////////////////////////////////////////////////////////////////
//
//      _,.---._               .=-.-.       ,-.-.    ,----.
//    ,-.' , -  `.    _.-.    /==/_ /,--.-./=/ ,/ ,-.--` , \
//   /==/_,  ,  - \ .-,.'|   |==|, |/==/, ||=| -||==|-  _.-`
//  |==|   .=.     |==|, |   |==|  |\==\,  \ / ,||==|   `.-.
//  |==|_ : ;=:  - |==|- |   |==|- | \==\ - ' - /==/_ ,    /
//  |==| , '='     |==|, |   |==| ,|  \==\ ,   ||==|    .-'
//   \==\ -    ,_ /|==|- `-._|==|- |  |==| -  ,/|==|_  ,`-._
//    '.='. -   .' /==/ - , ,/==/. /  \==\  _ / /==/ ,     /
//      `--`--''   `--`-----'`--`-`    `--`--'  `--`-----``
//
//////////////////////////////////////////////////////////////////

import { IERC20 } from "oz/token/ERC20/IERC20.sol";
import { SafeERC20 } from "oz/token/ERC20/utils/SafeERC20.sol";
import { IGPv2Settlement } from "./interfaces/IGPv2Settlement.sol";
import { IConditionalOrder } from "./interfaces/IConditionalOrder.sol";
import { IDCAFarm } from "./interfaces/IDCAFarm.sol";
import { GPv2Order } from "./libraries/GPv2Order.sol";
import { GPv2EIP1271, EIP1271Verifier } from "./interfaces/EIP1271Verifier.sol";
import { BokkyPooBahsDateTimeLibrary } from "date/BokkyPooBahsDateTimeLibrary.sol";
import { SafeMath } from "oz/utils/math/SafeMath.sol";
import { Math } from "oz/utils/math/Math.sol";

error OrderCancelled();
error NotOwner();
error NotReceiver();
error ReceiverIsOrder();
error MissingOwner();
error AlreadyInitialized();
error IntervalMustBeGreaterThanZero();
error InvalidStartTime();
error InvalidEndTime();
error NotWithinStartAndEndTimes();
error ZeroSellAmount();
error OrderExecutionTimeLessThanCurrentTime();

contract DCAFarm is IConditionalOrder, EIP1271Verifier, IDCAFarm {
  using GPv2Order for GPv2Order.Data;
  using SafeERC20 for IERC20;

  // Storage packing optimization: group addresses, then uint256, then bool
  /// @dev The owner of the order. The owner can cancel the order.
  address public owner;
  /// @dev All buyToken orders are sent to this address.
  address public receiver;
  /// @dev The token that is being traded in the order.
  IERC20 public sellToken;
  /// @dev The token that is DCA'd in the order.
  IERC20 public buyToken;
  /// @dev The start time of the DCA farm.
  uint256 public startTime;
  /// @dev The end time of the DCA farm.
  uint256 public endTime;
  /// @dev The frequency of the DCA farm in hours
  uint256 public interval;
  /// @dev The initial amount of the DCA farm.
  uint256 public amount;
  /// @dev Indicates that the order has been cancelled.
  bool public cancelled;
  /// @dev Domain separator for EIP-712 signing, must be public for test and off-chain access.
  bytes32 public domainSeparator;

  event Initialized(address indexed order);
  event Cancelled(address indexed order);

  /// @dev Initializes the DCAFarm with the specified parameters.
  /// @param _owner The owner of the order.
  /// @param _receiver The receiver of the buyToken orders.
  /// @param _sellToken The token that is being traded in the order.
  /// @param _amount The amount of the DCA farm.
  /// @param _buyToken The token that is DCA'd in the order.
  /// @param _startTime The start time of the DCA farm.
  /// @param _endTime The end time of the DCA farm.
  /// @param _interval The frequency interval of the DCA farm in hours.
  /// @param _settlementContract The settlement contract address.
  function initialize(
    address _owner,
    address _receiver,
    address _sellToken,
    address _buyToken,
    uint256 _amount,
    uint256 _startTime,
    uint256 _endTime,
    uint256 _interval,
    address _settlementContract
  ) external override returns (bool) {
    // Ensure that the order is not already initialized.
    if (owner != address(0)) {
      revert AlreadyInitialized();
    }
    // Ensure an owner is set
    if (_owner == address(0)) {
      revert MissingOwner();
    }
    // Ensure that the receiver is not the current contract.
    if (_receiver == address(this)) {
      revert ReceiverIsOrder();
    }
    if (_interval == 0) {
      revert IntervalMustBeGreaterThanZero();
    }
    // Start date must be in the future by at least 3 minutes
    // solhint-disable-next-line not-rely-on-time
    if (_startTime <= block.timestamp + 3 minutes) {
      revert InvalidStartTime();
    }
    // End time must be greater than start time
    if (_endTime <= _startTime) {
      revert InvalidEndTime();
    }
    // Set all the properties
    owner = _owner;
    receiver = _receiver;
    sellToken = IERC20(_sellToken);
    buyToken = IERC20(_buyToken);
    startTime = _startTime;
    endTime = _endTime;
    interval = _interval;
    amount = _amount;
    // Set domainSeparator only if needed, and as internal
    domainSeparator = IGPv2Settlement(_settlementContract).domainSeparator();

    // Approve the vaut relayer to spend the sell token
    IERC20(_sellToken).safeApprove(address(IGPv2Settlement(_settlementContract).vaultRelayer()), type(uint256).max);
    emit ConditionalOrderCreated(address(this)); // Required by COW to watch this contract
    // Emit Initialized event for indexing
    emit Initialized(address(this));
    return true;
  }

  /// @dev Cancels the order and transfers the funds back to the owner.
  function cancel() external {
    if (msg.sender != owner) {
      revert NotOwner();
    }
    cancelled = true;
    emit Cancelled(address(this));
    // Transfer funds back to owner
    sellToken.safeTransfer(owner, sellToken.balanceOf(address(this)));
  }

  // @dev If the `target`'s balance of `sellToken` is above the specified threshold, sell its entire balance
  // for `buyToken` at the current market price (no limit!).
  function getTradeableOrder() external view override returns (GPv2Order.Data memory) {
    // If the order is cancelled, return an empty order
    if (cancelled) {
      revert OrderCancelled();
    }
    // Order must be between start and end time
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp < startTime || block.timestamp > endTime) {
      revert NotWithinStartAndEndTimes();
    }
    uint256 orderExecutionTime = currentSlot();
    uint256 orderSellAmount = slotSellAmount();
    // Cannot create order with zero sell amount
    if (orderSellAmount == 0) {
      revert ZeroSellAmount();
    }
    // Create the order
    // ensures that orders queried shortly after one another result in the same hash (to avoid spamming the orderbook)
    // solhint-disable-next-line not-rely-on-time
    uint32 currentTimeBucket = ((uint32(orderExecutionTime) / 900) + 1) * 900;
    return GPv2Order.Data(
      sellToken,
      buyToken,
      receiver, // The receiver
      orderSellAmount,
      1, // 0 buy amount is not allowed
      currentTimeBucket + 900, // between 15 and 30 miunte validity
      keccak256("DollarCostAveraging"),
      0,
      GPv2Order.KIND_SELL,
      false,
      GPv2Order.BALANCE_ERC20,
      GPv2Order.BALANCE_ERC20
    );
    // uint32 currentTimeBucket = ((uint32(block.timestamp) / 900) + 1) * 900;
  }

  /// @param orderDigest The EIP-712 signing digest derived from the order
  /// @param encodedOrder Bytes-encoded order information, originally created by an off-chain bot. Created by concatening the order data (in the form of GPv2Order.Data), the price checker address, and price checker data.
  function isValidSignature(bytes32 orderDigest, bytes calldata encodedOrder) external view override returns (bytes4) {
    GPv2Order.Data memory order = abi.decode(encodedOrder, (GPv2Order.Data));
    require(order.hash(domainSeparator) == orderDigest, "encoded order digest mismatch");

    // If getTradeableOrder() may change between blocks (e.g. because of a variable exchange rate or exprity date, perform a proper attribute comparison with `order` here instead of matching full hashes)
    require(
      IConditionalOrder(this).getTradeableOrder().hash(domainSeparator) == orderDigest,
      "encoded order != tradable order"
    );

    return GPv2EIP1271.MAGICVALUE;
  }

  /// @dev get the total number of orders that will be executed between the start and end time
  function orderSlots() public view returns (uint256[] memory slots) {
    uint256 total = Math.ceilDiv(BokkyPooBahsDateTimeLibrary.diffHours(startTime, endTime), interval);
    slots = new uint256[](total);
    // Create execution orders
    for (uint256 i = 0; i < total; i++) {
      uint256 orderExecutionTime = startTime + (i * interval * 1 hours);
      slots[i] = orderExecutionTime;
    }
    return slots;
  }

  /// @dev returns the current slot based on the slots array
  /// @dev a slot is consider current if the current time is greater than the slot time and less than the next slot time (if it exists)
  function currentSlot() public view returns (uint256 slot) {
    uint256 _startTime = startTime;
    uint256 currentTime = block.timestamp;

    // Calculate the next time slot based on the current time
    if (currentTime < _startTime) {
      return 0;
    }

    // If the curernt time is beyond the end time, return 0 indicating no further time slots
    if (currentTime > endTime) {
      return 0;
    }

    uint256 intervalTimestamp = interval * 1 hours;
    return _startTime + (((currentTime - _startTime) / intervalTimestamp) * intervalTimestamp);
  }

  /// @dev Checks if the current timestamp corresponds to the last time slot within the specified interval.
  /// @return bool True if the current timestamp corresponds to the last time slot, otherwise false.
  function isLastSlot() public view returns (bool) {
    uint256 intervalTimestamp = interval * 1 hours;
    return (
      (startTime + ((((block.timestamp - startTime) / intervalTimestamp) + 1) * intervalTimestamp)) + intervalTimestamp
    ) > endTime;
  }

  /// @dev returns the sell amount for the each slot
  function slotSellAmount() public view returns (uint256 orderSellAmount) {
    // Execute at the specified frequency
    // Each order sellAmount is the balance of the order divided by the frequency
    // If the current slot is the last slot, the returned amount is the total sellToken balance
    uint256 _endTime = endTime;
    // solhint-disable-next-line not-rely-on-time
    if (isLastSlot()) {
      return sellToken.balanceOf(address(this));
    }

    if (block.timestamp >= _endTime) {
      return 0;
    }

    // amount divided by total amount of orders
    (, orderSellAmount) =
      SafeMath.tryDiv(amount, (Math.ceilDiv(BokkyPooBahsDateTimeLibrary.diffHours(startTime, _endTime), interval)));
  }
}
