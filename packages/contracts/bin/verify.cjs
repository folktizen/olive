#!/usr/bin/env node

/**
 * Usage: node bin/verify.cjs <verifier> <api-key>
 * <verifier>: etherscan | oklink
 * <api-key>: Your API key for the selected verifier
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Path to the deployed contracts JSON. Update if the storage location changes.
const CONTRACTS_PATH = path.resolve(__dirname, "../storage/contracts.json")

// Maps contract logical names to their source path and contract name.
// Add new contract types here if you deploy more contracts in the future.
const CONTRACTS_SRC = {
  DCAFarm: "src/DCAFarm.sol:DCAFarm",
  TradeFoundry: "src/TradeFoundry.sol:TradeFoundry",
  Create2Deployer: "src/Create2Deployer.sol:Create2Deployer"
}

// Chain configuration for verification. Add new chains here as needed.
// Each entry must include the chainId and Oklink verifier URL.
const CHAIN_INFO = {
  ethereum: {
    chainId: 1,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/eth"
  },
  arbitrum: {
    chainId: 42161,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/arbitrum"
  },
  polygon: {
    chainId: 137,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/polygon"
  },
  base: {
    chainId: 8453,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/base"
  },
  gnosis: {
    chainId: 100,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/gnosis"
  },
  avalanche: {
    chainId: 43114,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/avalanche"
  }
}

function usage() {
  console.log(
    `Usage: node bin/verify.cjs <verifier> <api-key>\n  <verifier>: etherscan | oklink\n  <api-key>: Your API key for the selected verifier\n  `
  )
  process.exit(1)
}

if (process.argv.length < 4) usage()
const VERIFIER = process.argv[2]
const API_KEY = process.argv[3]

if (!["etherscan", "oklink"].includes(VERIFIER)) usage()

let contracts
try {
  contracts = JSON.parse(fs.readFileSync(CONTRACTS_PATH, "utf8"))
} catch (e) {
  console.error(`Failed to read contracts file at ${CONTRACTS_PATH}`)
  process.exit(1)
}

for (const entry of contracts) {
  const { chain, dcaFarm, tradeFoundry, create2Deployer } = entry
  const info = CHAIN_INFO[chain]
  if (!info) {
    continue
  }

  for (const [name, address] of Object.entries({
    DCAFarm: dcaFarm,
    TradeFoundry: tradeFoundry,
    Create2Deployer: create2Deployer
  })) {
    if (!address) continue
    let cmd = `forge verify-contract ${address} ${CONTRACTS_SRC[name]}`
    if (VERIFIER === "etherscan") {
      cmd += ` --chain-id ${info.chainId} --etherscan-api-key ${API_KEY}`
    } else if (VERIFIER === "oklink") {
      cmd += ` --verifier oklink --verifier-url ${info.oklinkUrl} --api-key ${API_KEY}`
    }
    console.log(`\nVerifying ${name} on ${chain}:\n${cmd}`)
    try {
      execSync(cmd, { stdio: "inherit" })
    } catch (e) {
      console.error(`Verification failed for ${name} on ${chain}`)
    }
  }
}
