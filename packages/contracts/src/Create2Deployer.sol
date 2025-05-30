// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//////////////////////////////////////////////////////////////////
// @title   Olive Protocol
// @notice  More at: https://useolive.space
// @version 1.0.0
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

/**
 * @title Create2Deployer
 * @notice Deploys contracts using CREATE2 for deterministic addresses.
 */
contract Create2Deployer {
  event Deployed(address addr, bytes32 salt);

  function deploy(bytes memory bytecode, bytes32 salt) public returns (address) {
    address addr;
    assembly ("memory-safe") {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
      if iszero(extcodesize(addr)) { revert(0, 0) }
    }
    emit Deployed(addr, salt);
    return addr;
  }

  function computeAddress(bytes32 salt, bytes32 bytecodeHash) public view returns (address) {
    return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash)))));
  }

  function callTransferOwnership(address target, address newOwner) public {
    (bool success,) = target.call(abi.encodeWithSignature("transferOwnership(address)", newOwner));
    require(success, "transferOwnership failed");
  }
}
