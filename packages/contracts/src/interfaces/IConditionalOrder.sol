// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma abicoder v2;

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

import { GPv2Order } from "../libraries/GPv2Order.sol";

interface IConditionalOrder {
  /// Event that should be emitted in constructor so that the service "watching" for conditional orders can start indexing it
  event ConditionalOrderCreated(address indexed);

  /// Returns an order that if posted to the CoW Protocol API would pass signature validation
  /// Reverts in case current order condition is not met
  function getTradeableOrder() external view returns (GPv2Order.Data memory);
}
