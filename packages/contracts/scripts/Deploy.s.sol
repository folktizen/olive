// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title Deploy
 * @notice Deploys DCAFarm and TradeFoundry contracts to multiple EVM chains using Foundry's scripting and forking features.
 *
 * @dev Usage:
 *   1. Ensure your foundry.toml [rpc_endpoints] section includes the desired chain names (e.g., ethereum, arbitrum).
 *   2. Set the PRIVATE_KEY environment variable to your deployer account's private key.
 *   3. (Optional) Create a 'storage/' folder in the project root to store deployment JSON files.
 *   4. Run the script with:
 *        forge script script/Deploy.s.sol --slow --multi --broadcast --private-key <your_private_key>
 *
 *   The script will:
 *     - Deploy contracts to each chain in the 'chains' array.
 *     - Print deployment info to the console.
 *     - Save a JSON file with contract addresses for each chain in the 'storage/' folder, named with the chain and timestamp.
 *
 *   Note: The same deployer and nonce/order of deployment will result in the same contract addresses across chains.
 */
import "forge-std/Script.sol";
import "../src/DCAFarm.sol";
import "../src/TradeFoundry.sol";
import "../src/Create2Deployer.sol";

contract Deploy is Script {
  function getChains() internal pure returns (string[] memory) {
    string[] memory arr = new string[](5);
    uint256 idx = 0;
    arr[idx++] = "ethereum";
    // arr[idx++] = "polygon";
    // arr[idx++] = "arbitrum";
    // arr[idx++] = "base";
    // arr[idx++] = "gnosis";
    // Resize to enabled chains
    string[] memory enabled = new string[](idx);
    for (uint256 i = 0; i < idx; i++) {
      enabled[i] = arr[i];
    }
    return enabled;
  }

  function deployForChain(
    string memory chain,
    uint256 deployerPrivateKey,
    address eoaDeployer,
    bytes32 dcaFarmSalt,
    bytes32 tradeFoundrySalt,
    bytes32 deployerSalt
  ) internal {
    vm.createSelectFork(chain);
    vm.startBroadcast(deployerPrivateKey);

    // 1. Deploy Create2Deployer (if not already deployed)
    bytes memory deployerBytecode = type(Create2Deployer).creationCode;
    address deployerPredicted = address(
      uint160(
        uint256(keccak256(abi.encodePacked(bytes1(0xff), eoaDeployer, deployerSalt, keccak256(deployerBytecode))))
      )
    );
    address create2Deployer = deployerPredicted;
    if (create2Deployer.code.length == 0) {
      create2Deployer = address(new Create2Deployer{ salt: deployerSalt }());
    }

    // 2. Deploy DCAFarm singleton via CREATE2
    bytes memory dcaFarmBytecode = type(DCAFarm).creationCode;
    address dcaFarmPredicted = Create2Deployer(create2Deployer).computeAddress(dcaFarmSalt, keccak256(dcaFarmBytecode));
    address dcaFarmSingleton = dcaFarmPredicted;
    if (dcaFarmSingleton.code.length == 0) {
      dcaFarmSingleton = Create2Deployer(create2Deployer).deploy(dcaFarmBytecode, dcaFarmSalt);
    }

    // 3. Deploy TradeFoundry singleton via CREATE2
    bytes memory tradeFoundryBytecode = type(TradeFoundry).creationCode;
    address tradeFoundryPredicted =
      Create2Deployer(create2Deployer).computeAddress(tradeFoundrySalt, keccak256(tradeFoundryBytecode));
    address tradeFoundrySingleton = tradeFoundryPredicted;
    if (tradeFoundrySingleton.code.length == 0) {
      tradeFoundrySingleton = Create2Deployer(create2Deployer).deploy(tradeFoundryBytecode, tradeFoundrySalt);
    }

    // Transfer ownership of TradeFoundry to the specified owner (two-step)
    Create2Deployer(create2Deployer).callTransferOwnership(
      tradeFoundrySingleton, 0xcf42F35A7dB4b37769B8519b323202A32520e673
    );

    // Optionally, if the deployer EOA is the same as the new owner, immediately accept ownership
    if (eoaDeployer == 0xcf42F35A7dB4b37769B8519b323202A32520e673) {
      (bool success,) = tradeFoundrySingleton.call(abi.encodeWithSignature("acceptOwnership()"));
      require(success, "acceptOwnership failed");
    }

    // Note: DCAFarm singleton does not support ownership transfer, so skip this step.

    vm.stopBroadcast();

    // Prepare deployment info as JSON
    string memory json = string.concat(
      "{\n",
      '  "chain": "',
      chain,
      '",\n',
      '  "dcaFarm": "',
      vm.toString(dcaFarmSingleton),
      '",\n',
      '  "tradeFoundry": "',
      vm.toString(tradeFoundrySingleton),
      '",\n',
      '  "create2Deployer": "',
      vm.toString(create2Deployer),
      '"\n',
      "}"
    );

    // Print deployment info to console
    console2.log("\n--- DEPLOYED OLIVE ON", chain, "---\n");
    console2.log(json);
  }

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address eoaDeployer = vm.addr(deployerPrivateKey);
    string[] memory chains = getChains();
    bytes32 dcaFarmSalt = keccak256("OLIVE_DCAFARM_SINGLETON_KOMODO");
    bytes32 tradeFoundrySalt = keccak256("OLIVE_TRADEFOUNDRY_SINGLETON_KOMODO");
    bytes32 deployerSalt = keccak256("OLIVE_CREATE2_DEPLOYER_KOMODO");
    for (uint256 i = 0; i < chains.length; i++) {
      deployForChain(chains[i], deployerPrivateKey, eoaDeployer, dcaFarmSalt, tradeFoundrySalt, deployerSalt);
    }
  }
}
