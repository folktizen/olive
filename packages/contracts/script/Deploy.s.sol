// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DCAOrder.sol";
import "../src/OrderFactory.sol";

contract Deploy is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    DCAOrder dcaOrder = new DCAOrder();
    OrderFactory orderFactory = new OrderFactory();

    vm.stopBroadcast();

    console2.log("\n--- DEPLOYED FOLKSY CONTRACTS ---\n");
    console2.log(
      string.concat(
        "{\n",
        '  "dcaOrder": "',
        vm.toString(address(dcaOrder)),
        '",\n',
        '  "orderFactory": "',
        vm.toString(address(orderFactory)),
        '",\n',
        "}"
      )
    );
  }
}
