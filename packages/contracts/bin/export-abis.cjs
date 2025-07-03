const { mkdir, writeFile } = require("fs/promises")
const DCAFarmArtifacts = require("../out/DCAFarm.sol/DCAFarm.json")
const ERC20Artifacts = require("../out/ERC20.sol/ERC20.json")
const TradeFoundryArtifacts = require("../out/TradeFoundry.sol/TradeFoundry.json")

async function main() {
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
