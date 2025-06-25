// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import { GasMeter } from "./helper/GasMeter.sol";
import { ERC20Mintable } from "./common/ERC20Mintable.sol";
import { MockSettlement } from "./common/MockSettlement.sol";
import { SafeMath } from "oz/utils/math/SafeMath.sol";

import { GPv2Order } from "../src/libraries/GPv2Order.sol";
import { DCAFarm, NotOwner, NotWithinStartAndEndTimes } from "../src/DCAFarm.sol";
import { IConditionalOrder } from "../src/interfaces/IConditionalOrder.sol";

contract DCAFarmTest is Test, GasMeter {
  using GPv2Order for GPv2Order.Data;

  MockSettlement public mockSettlement;
  DCAFarm public dcaFarm;
  ERC20Mintable public sellToken;
  address public _owner;
  address public _receiver;
  address public _sellToken;
  address public _buyToken;
  uint256 public _interval;
  uint256 public _startTime;
  uint256 public _endTime;
  uint256 public _amount;

  // @todo: import from IConditionalOrder
  event ConditionalOrderCreated(address indexed);

  // @todo: import from DCAFarm
  event Initialized(address indexed order);
  event Cancelled(address indexed order);

  function setUp() public {
    mockSettlement = new MockSettlement();
    dcaFarm = new DCAFarm();
    sellToken = new ERC20Mintable("Test Token", "TEST");
    sellToken.mint(address(this), 10_000 ether);

    _owner = address(this);
    _receiver = address(0x2);
    _sellToken = address(sellToken);
    _buyToken = address(0x3);
    _interval = 1; // every 1 hours
    _startTime = block.timestamp + 1 hours;
    _endTime = _startTime + 1 days;
    _amount = 10 ether;
  }

  function testInitialize_success() public {
    vm.expectEmit(true, true, false, true, address(dcaFarm));
    emit ConditionalOrderCreated(address(dcaFarm));

    vm.expectEmit(true, true, false, true, address(dcaFarm));
    emit Initialized(address(dcaFarm));

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    // Assert all properties are set correctly
    assertEq(dcaFarm.owner(), _owner);
    assertEq(dcaFarm.receiver(), _receiver);
    assertEq(address(dcaFarm.sellToken()), address(sellToken));
    assertEq(address(dcaFarm.buyToken()), _buyToken);
    assertEq(dcaFarm.startTime(), _startTime);
    assertEq(dcaFarm.endTime(), _endTime);
    assertEq(dcaFarm.interval(), _interval);
    assertEq(dcaFarm.amount(), _amount);
    assertEq(dcaFarm.domainSeparator(), mockSettlement.domainSeparator());
  }

  function testInitialize_AlreadyInitialized() public {
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    vm.expectRevert(bytes4(keccak256("AlreadyInitialized()")));

    // Try to initialize again
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
  }

  function testInitialize_MissingOwner() public {
    vm.expectRevert(bytes4(keccak256("MissingOwner()")));

    dcaFarm.initialize(
      address(0), _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
  }

  function testInitialize_ReceiverIsOrder() public {
    vm.expectRevert(bytes4(keccak256("ReceiverIsOrder()")));

    dcaFarm.initialize(
      _owner, address(dcaFarm), _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
  }

  function testInitialize_IntervalMustBeGreaterThanZero() public {
    vm.expectRevert(bytes4(keccak256("IntervalMustBeGreaterThanZero()")));

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, 0, address(mockSettlement)
    );
  }

  function testInitialize_InvalidStartTime() public {
    vm.expectRevert(bytes4(keccak256("InvalidStartTime()")));

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, block.timestamp, _endTime, _interval, address(mockSettlement)
    );
  }

  function testInitialize_InvalidEndTime() public {
    vm.expectRevert(bytes4(keccak256("InvalidEndTime()")));

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, block.timestamp, _interval, address(mockSettlement)
    );
  }

  function testSlots() public {
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    uint256[] memory slots = dcaFarm.orderSlots();
    // In a 24 hour period, there should be 24 slots
    assertEq(slots.length, 24);
    // The first slot should be the startTime
    assertEq(slots[0], _startTime);
    // The last slot should be the endTime - 1 hour
    assertEq(slots[23], _endTime - 1 hours);
    // Between each slot, there should be an interval of 1 hour
    for (uint256 i = 0; i < slots.length - 1; i++) {
      assertEq(slots[i + 1] - slots[i], 1 hours);
    }
  }

  function testCanCancelOrder() public {
    sellToken.transfer(address(dcaFarm), _amount);
    // different clean address
    address newCleanOwner = address(0x10);

    dcaFarm.initialize(
      newCleanOwner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
    assertEq(sellToken.balanceOf(address(dcaFarm)), _amount);
    assertEq(sellToken.balanceOf(newCleanOwner), 0);

    vm.expectEmit(true, true, false, true, address(dcaFarm));
    emit Cancelled(address(dcaFarm));

    vm.prank(newCleanOwner);
    dcaFarm.cancel();
    // Balance should be 0
    assertEq(sellToken.balanceOf(address(dcaFarm)), 0);
    assertEq(sellToken.balanceOf(newCleanOwner), _amount);
  }

  function testCannotCancelOrderIfNotOwner() public {
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
    vm.prank(address(0x1));
    vm.expectRevert(NotOwner.selector);
    dcaFarm.cancel();
  }

  /// @dev add fuzzing to test the current slot
  function testCurrentSlot() public {
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
    vm.prank(address(0x1));

    // warp to 1 hour before the startTime
    vm.warp(dcaFarm.startTime() - 1 hours);
    // the current slot should be 0
    assertEq(dcaFarm.currentSlot(), 0);

    // warp to the startTime of the order
    vm.warp(dcaFarm.startTime());
    // the current slot should be the startTime
    assertEq(dcaFarm.currentSlot(), _startTime);
    // warp to 1 hour after the startTime
    vm.warp(dcaFarm.startTime() + 1 hours);
    assertEq(dcaFarm.currentSlot(), _startTime + 1 hours);
    // warp to 10 hours after the startTime
    vm.warp(dcaFarm.startTime() + 10 hours);
    assertEq(dcaFarm.currentSlot(), _startTime + 10 hours);
    // warp to 15 hours after the startTime
    vm.warp(dcaFarm.startTime() + 15 hours);
    assertEq(dcaFarm.currentSlot(), _startTime + 15 hours);
    // warp to 15 hours after the startTime, add a couple more seconds
    vm.warp(dcaFarm.startTime() + 15 hours + 5 seconds);
    assertEq(dcaFarm.currentSlot(), _startTime + 15 hours);
    // warp to the endTime of the order
    vm.warp(dcaFarm.endTime() - 0.5 hours);
    assertEq(dcaFarm.currentSlot(), _endTime - 1 hours);
    // warp to after the endTime of the order
    vm.warp(dcaFarm.endTime() + 0.1 hours);
    // should return 0
    assertEq(dcaFarm.currentSlot(), 0);
  }

  /// @dev add fuzzing to test the current slot
  function testGetTradeableOrder() public {
    uint256 _testAmount = 30 ether;

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _testAmount, _startTime, _endTime, _interval, address(mockSettlement)
    );
    vm.prank(address(0x1));

    // warp to 1 hour before the startTime
    vm.warp(dcaFarm.startTime() - 1 hours);
    // Should revert because the order is not tradeable
    vm.expectRevert(NotWithinStartAndEndTimes.selector);
    dcaFarm.getTradeableOrder();
    // the current slot should be 0
    assertEq(dcaFarm.currentSlot(), 0);
    // warp to the startTime of the order
    vm.warp(dcaFarm.startTime());

    GPv2Order.Data memory order = dcaFarm.getTradeableOrder();

    emit log_address(address(order.sellToken));

    assertEq(address(order.sellToken), _sellToken);
    assertEq(address(order.buyToken), _buyToken);

    uint256 orderSlots = dcaFarm.orderSlots().length;
    emit log_uint(uint256(order.sellAmount));
    emit log_uint(orderSlots);

    (, uint256 expectedOrderSellAmount) = SafeMath.tryDiv(_testAmount, orderSlots);
    assertEq(order.sellAmount, expectedOrderSellAmount);
    // warp to 5 hours after the endTime
    vm.warp(dcaFarm.endTime() + 5 hours);
    // Should revert because the order is not tradeable
    vm.expectRevert(NotWithinStartAndEndTimes.selector);
    order = dcaFarm.getTradeableOrder();
  }

  function testGetTradeableOrder_GasUsage() public {
    uint256 _testAmount = 30 ether;

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _testAmount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    // warp to the startTime of the order
    vm.warp(dcaFarm.startTime());

    gasMeterStart();
    dcaFarm.getTradeableOrder();
    uint256 gas = gasMeterStop();

    assertLt(gas, 40_000);
  }

  function testGetTradeableOrder_GasUsage_2_years() public {
    // 2 year long hourly farm
    uint256 endTime = _startTime + (1 days * 365 * 2);
    uint256 interval = 1;
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, 30 ether, _startTime, endTime, interval, address(mockSettlement)
    );

    // warp to the startTime of the order
    vm.warp(dcaFarm.startTime());

    gasMeterStart();
    dcaFarm.getTradeableOrder();
    uint256 gas = gasMeterStop();

    assertLt(gas, 40_000);
  }

  function testGetTradeableOrder_OrderCancelled() public {
    uint256 _testPrincipal = 30 ether;

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _testPrincipal, _startTime, _endTime, _interval, address(mockSettlement)
    );

    // Cancel the order
    dcaFarm.cancel();

    vm.expectRevert(bytes4(keccak256("OrderCancelled()")));
    dcaFarm.getTradeableOrder();
  }

  function testGetTradeableOrder_ZeroSellAmount() public {
    uint256 _testPrincipal = 0 ether;

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _testPrincipal, _startTime, _endTime, _interval, address(mockSettlement)
    );

    vm.warp(dcaFarm.startTime());
    vm.expectRevert(bytes4(keccak256("ZeroSellAmount()")));
    dcaFarm.getTradeableOrder();
  }

  function testHourlyOverWeeksDCAFarms() public {
    _endTime = _startTime + 6 weeks;

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );
    // In a 6 week period, there should be 6 * 7 * 24 = 1008 slots
    uint256[] memory slots = dcaFarm.orderSlots();
    assertEq(slots.length, 1008);
  }

  function testDailyOverWeeksDCAFarms() public {
    _endTime = _startTime + 6 weeks;
    dcaFarm.initialize(
      _owner,
      _receiver,
      _sellToken,
      _buyToken,
      _amount,
      _startTime,
      _endTime,
      24, // 1 day
      address(mockSettlement)
    );
    // In a 6 week period, there should be 6 * 7 = 42 slots
    uint256[] memory slots = dcaFarm.orderSlots();
    assertEq(slots.length, 42);
  }

  function testEveryThreeDaysInWeeksDCAFarms() public {
    _endTime = _startTime + 12 weeks;
    dcaFarm.initialize(
      _owner,
      _receiver,
      _sellToken,
      _buyToken,
      _amount,
      _startTime,
      _endTime,
      24 * 3, // 3 days
      address(mockSettlement)
    );
    // in a 12 week period where buys are every 3 days, there should be 12 * 7 / 3 = 28 slots
    uint256[] memory slots = dcaFarm.orderSlots();
    assertEq(slots.length, 28);
  }

  /// @dev add fuzzing to test the current slot
  function testOrderLeftover() public {
    // big amount for testing edge cases where there is some leftover
    uint256 _testAmount = 31.434343536565656434 ether;
    sellToken.transfer(address(dcaFarm), _testAmount);

    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _testAmount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    uint256 orderSlotsLength = dcaFarm.orderSlots().length;
    // warp to the startTime of the order
    for (uint256 i = 0; i < orderSlotsLength; i++) {
      vm.warp(dcaFarm.startTime() + i * 1 hours);

      uint256 balanceBeforeTransfer = sellToken.balanceOf(address(dcaFarm));

      GPv2Order.Data memory order = dcaFarm.getTradeableOrder();
      vm.prank(address(dcaFarm));
      // fake token transfer
      sellToken.transfer(address(0x10), order.sellAmount);

      (, uint256 expectedOrderSellAmount) = SafeMath.tryDiv(_testAmount, orderSlotsLength);

      if (i == orderSlotsLength - 1) assertEq(order.sellAmount, balanceBeforeTransfer);
      else assertEq(order.sellAmount, expectedOrderSellAmount);
    }
    assertEq(sellToken.balanceOf(address(dcaFarm)), 0);
  }

  function testisValidSignature() public {
    dcaFarm.initialize(
      _owner, _receiver, _sellToken, _buyToken, _amount, _startTime, _endTime, _interval, address(mockSettlement)
    );

    // Advances block.timestamp by n seconds
    skip(3601);

    bytes32 orderDigest = dcaFarm.getTradeableOrder().hash(dcaFarm.domainSeparator());
    bytes memory encodedOrder = abi.encode(dcaFarm.getTradeableOrder());
    bytes4 output = dcaFarm.isValidSignature(orderDigest, encodedOrder);
    assertTrue(output == 0x1626ba7e);
  }
}
