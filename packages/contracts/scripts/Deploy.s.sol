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
    bytes32 dcaOrderSalt,
    bytes32 orderFactorySalt,
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

    // 2. Deploy DCAOrder singleton via CREATE2
    bytes memory dcaOrderBytecode = type(DCAOrder).creationCode;
    address dcaOrderPredicted =
      Create2Deployer(create2Deployer).computeAddress(dcaOrderSalt, keccak256(dcaOrderBytecode));
    address dcaOrderSingleton = dcaOrderPredicted;
    if (dcaOrderSingleton.code.length == 0) {
      dcaOrderSingleton = Create2Deployer(create2Deployer).deploy(dcaOrderBytecode, dcaOrderSalt);
    }

    // 3. Deploy OrderFactory singleton via CREATE2
    bytes memory orderFactoryBytecode = type(OrderFactory).creationCode;
    address orderFactoryPredicted =
      Create2Deployer(create2Deployer).computeAddress(orderFactorySalt, keccak256(orderFactoryBytecode));
    address orderFactorySingleton = orderFactoryPredicted;
    if (orderFactorySingleton.code.length == 0) {
      orderFactorySingleton = Create2Deployer(create2Deployer).deploy(orderFactoryBytecode, orderFactorySalt);
    }

    // Transfer ownership of OrderFactory to the specified owner (two-step)
    Create2Deployer(create2Deployer).callTransferOwnership(
      orderFactorySingleton, 0xcf42F35A7dB4b37769B8519b323202A32520e673
    );

    // Optionally, if the deployer EOA is the same as the new owner, immediately accept ownership
    if (eoaDeployer == 0xcf42F35A7dB4b37769B8519b323202A32520e673) {
      (bool success,) = orderFactorySingleton.call(abi.encodeWithSignature("acceptOwnership()"));
      require(success, "acceptOwnership failed");
    }

    // Note: DCAOrder singleton does not support ownership transfer, so skip this step.

    vm.stopBroadcast();

    // Prepare deployment info as JSON
    string memory json = string.concat(
      "{\n",
      '  "chain": "',
      chain,
      '",\n',
      '  "dcaOrder": "',
      vm.toString(dcaOrderSingleton),
      '",\n',
      '  "orderFactory": "',
      vm.toString(orderFactorySingleton),
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
    bytes32 dcaOrderSalt = keccak256("OLIVE_DCAORDER_SINGLETON_ATLAS");
    bytes32 orderFactorySalt = keccak256("OLIVE_ORDERFACTORY_SINGLETON_ATLAS");
    bytes32 deployerSalt = keccak256("OLIVE_CREATE2_DEPLOYER_ATLAS");
    for (uint256 i = 0; i < chains.length; i++) {
      deployForChain(chains[i], deployerPrivateKey, eoaDeployer, dcaOrderSalt, orderFactorySalt, deployerSalt);
    }
  }
}
