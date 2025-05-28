// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//////////////////////////////////////////////////////////////////
// @title   Olive Protocol
// @notice  More at: https://useolive.space
// @version 3.0.0
// @author  Folktizen
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

interface IGPv2Settlement {
  /// @dev Sets a presignature for the specified order UID.
  ///
  /// @param orderUid The unique identifier of the order to pre-sign.
  function setPreSignature(bytes calldata orderUid, bool signed) external;

  function vaultRelayer() external view returns (address);

  function domainSeparator() external view returns (bytes32);
}
