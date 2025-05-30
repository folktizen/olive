// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title Deploy
 * @notice Deploys DCAOrder and OrderFactory contracts to multiple EVM chains using Foundry's scripting and forking features.
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
import "../src/DCAOrder.sol";
import "../src/OrderFactory.sol";

contract Deploy is Script {
  function getChains() internal pure returns (string[] memory) {
    string[] memory arr = new string[](5);
    uint256 idx = 0;
    // arr[idx++] = "ethereum";
    arr[idx++] = "polygon";
    arr[idx++] = "arbitrum";
    arr[idx++] = "base";
    arr[idx++] = "gnosis";
    // Resize to enabled chains
    string[] memory enabled = new string[](idx);
    for (uint256 i = 0; i < idx; i++) {
      enabled[i] = arr[i];
    }
    return enabled;
  }

  function deployForChain(string memory chain, uint256 deployerPrivateKey, address eoaDeployer) internal {
    vm.createSelectFork(chain);
    vm.startBroadcast(deployerPrivateKey);

    // Deploy DCAOrder singleton via traditional deployment
    DCAOrder dcaOrderSingleton = new DCAOrder();

    // Deploy OrderFactory singleton via traditional deployment, passing deployer as newOwner
    OrderFactory orderFactorySingleton = new OrderFactory();
    orderFactorySingleton.transferOwnership(eoaDeployer);

    vm.stopBroadcast();

    // Prepare deployment info as JSON
    string memory json = string.concat(
      "{\n",
      '  "chain": "',
      chain,
      '",\n',
      '  "dcaOrder": "',
      vm.toString(address(dcaOrderSingleton)),
      '",\n',
      '  "orderFactory": "',
      vm.toString(address(orderFactorySingleton)),
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
    for (uint256 i = 0; i < chains.length; i++) {
      deployForChain(chains[i], deployerPrivateKey, eoaDeployer);
    }
  }
}
