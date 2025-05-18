// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DCAOrder.sol";
import "../src/OrderFactory.sol";

contract Deploy is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // List of chain names as in foundry.toml [rpc_endpoints]
    string[3] memory chains = ["ethereum", "gnosis", "arbitrum"];

    for (uint256 i = 0; i < chains.length; i++) {
      string memory chain = chains[i];
      vm.createSelectFork(chain);
      vm.startBroadcast(deployerPrivateKey);
      DCAOrder dcaOrder = new DCAOrder();
      OrderFactory orderFactory = new OrderFactory();
      vm.stopBroadcast();
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
      console2.log("\n--- DEPLOYED OLIVE CONTRACTS ON ", chain, " ---\n");
      console2.log(json);
      // Save to storage folder with timestamp
      string memory timestamp = vm.toString(block.timestamp);
      string memory filename = string.concat("storage/deploy_", chain, "_", timestamp, ".json");
      vm.writeFile(filename, json);
    }
  }
}
