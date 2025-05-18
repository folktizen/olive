// SPDX-License-Identifier: AGPL-3.0-or-later
// Signature: 817b854143c203570e69446f8df6653c
pragma solidity ^0.8.20;

interface IGPv2Settlement {
    /// @dev Sets a presignature for the specified order UID.
    ///
    /// @param orderUid The unique identifier of the order to pre-sign.
    function setPreSignature(bytes calldata orderUid, bool signed) external;

    function vaultRelayer() external view returns (address);

    function domainSeparator() external view returns (bytes32);
}
