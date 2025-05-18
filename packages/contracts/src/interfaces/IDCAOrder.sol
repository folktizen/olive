// SPDX-License-Identifier: AGPL-3.0-or-later
// Signature: 817b854143c203570e69446f8df6653c
pragma solidity ^0.8.20;
pragma abicoder v2;

interface IDCAOrder {
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
    ) external returns (bool);
}
