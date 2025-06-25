import { mkdir, writeFile } from "fs/promises"
import DCAFarmArtifacts from "../out/DCAFarm.sol/DCAFarm.json"
import ERC20Artifacts from "../out/ERC20.sol/ERC20.json"
import TradeFoundryArtifacts from "../out/TradeFoundry.sol/TradeFoundry.json"

async function main(): Promise<void> {
  await mkdir("./abis", { recursive: true })
  console.log("Created abis directory (if not exists)")

  await writeFile(
    "./abis/DCAFarm.json",
    JSON.stringify(DCAFarmArtifacts.abi, null, 2)
  )
  console.log("Exported DCAFarm ABI")
  await writeFile(
    "./abis/TradeFoundry.json",
    JSON.stringify(TradeFoundryArtifacts.abi, null, 2)
  )
  console.log("Exported TradeFoundry ABI")
  await writeFile(
    "./abis/ERC20.json",
    JSON.stringify(ERC20Artifacts.abi, null, 2)
  )
  console.log("Exported ERC20 ABI")
  console.log("All ABIs exported successfully!")
}

main()
