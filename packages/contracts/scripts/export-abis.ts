import { mkdir, writeFile } from "fs/promises";
import DCAOrderArtifacts from "../out/DCAOrder.sol/DCAOrder.json";
import ERC20Artifacts from "../out/ERC20.sol/ERC20.json";
import OrderFactoryArtifacts from "../out/OrderFactory.sol/OrderFactory.json";

async function main(): Promise<void> {
  await mkdir("./abis", { recursive: true });
  console.log("Created abis directory (if not exists)");

  await writeFile("./abis/DCAOrder.json", JSON.stringify(DCAOrderArtifacts.abi, null, 2));
  console.log("Exported DCAOrder ABI");
  await writeFile("./abis/OrderFactory.json", JSON.stringify(OrderFactoryArtifacts.abi, null, 2));
  console.log("Exported OrderFactory ABI");
  await writeFile("./abis/ERC20.json", JSON.stringify(ERC20Artifacts.abi, null, 2));
  console.log("Exported ERC20 ABI");
  console.log("All ABIs exported successfully!");
}

main();
