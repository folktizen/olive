// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title DeployTestnet
 * @notice Deploys DCAOrder and OrderFactory contracts to multiple EVM testnets using Foundry's scripting and forking features.
 *
 * @dev Usage:
 *   1. Ensure your foundry.toml [rpc_endpoints] section includes the desired testnet chain names (e.g., sepolia, base-sepolia, polygon-mumbai).
 *   2. Set the PRIVATE_KEY environment variable to your deployer account's private key.
 *   3. (Optional) Create a 'storage/' folder in the project root to store deployment JSON files.
 *   4. Run the script with:
 *        forge script script/DeployTestnet.s.sol --slow --multi --broadcast --private-key <your_private_key>
 *
 *   The script will:
 *     - Deploy contracts to each testnet in the 'chains' array.
 *     - Print deployment info to the console.
 *     - Save a JSON file with contract addresses for each testnet in the 'storage/' folder, named with the chain and timestamp.
 *
 *   Note: The same deployer and nonce/order of deployment will result in the same contract addresses across testnets.
 */
import "forge-std/Script.sol";
import "../src/DCAOrder.sol";
import "../src/OrderFactory.sol";

contract DeployTestnet is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // List of testnet chain names as in foundry.toml [rpc_endpoints]
    string[3] memory chains = ["sepolia", "base-sepolia", "polygon-mumbai"];

    for (uint256 i = 0; i < chains.length; i++) {
      string memory chain = chains[i];

      // Switch fork context to the target testnet
      vm.createSelectFork(chain);
      vm.startBroadcast(deployerPrivateKey);

      // Deploy contracts in the same order for deterministic addresses
      DCAOrder dcaOrder = new DCAOrder();
      OrderFactory orderFactory = new OrderFactory();
      vm.stopBroadcast();

      // Prepare deployment info as JSON
      string memory json = string.concat(
        "{\n",
        '  "chain": "',
        chain,
        '",\n',
        '  "dcaOrder": "',
        vm.toString(address(dcaOrder)),
        '",\n',
        '  "orderFactory": "',
        vm.toString(address(orderFactory)),
        '"\n',
        "}"
      );

      // Print deployment info to console
      console2.log("\n--- DEPLOYED OLIVE CONTRACTS ON ", chain, " ---\n");
      console2.log(json);

      // Save deployment info to storage folder with timestamp
      string memory timestamp = vm.toString(block.timestamp);
      string memory filename = string.concat("storage/deploy_", chain, "_", timestamp, ".json");
      vm.writeFile(filename, json);
    }
  }
}
