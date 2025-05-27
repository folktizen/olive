#!/usr/bin/env bun

/**
 * Usage: bun run verify <verifier> <api-key>
 * <verifier>: etherscan | oklink
 * <api-key>: Your API key for the selected verifier
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Path to the deployed contracts JSON. Update if the storage location changes.
const CONTRACTS_PATH = path.resolve(__dirname, "../storage/contracts.json")

// Maps contract logical names to their source path and contract name.
// Add new contract types here if you deploy more contracts in the future.
const CONTRACTS_SRC: Record<string, string> = {
  DCAOrder: "src/DCAOrder.sol:DCAOrder",
  OrderFactory: "src/OrderFactory.sol:OrderFactory"
}

// Chain configuration for verification. Add new chains here as needed.
// Each entry must include the chainId and Oklink verifier URL.
const CHAIN_INFO: Record<string, { chainId: number; oklinkUrl: string }> = {
  base: {
    chainId: 8453,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/base"
  },
  arbitrum: {
    chainId: 42161,
    oklinkUrl:
      "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/arbitrum"
  }
}

// Prints usage instructions and exits. Update if you add more CLI options.
function usage(): never {
  console.log(
    `Usage: bun run scripts/verify.ts <verifier> <api-key>\n  <verifier>: etherscan | oklink\n  <api-key>: Your API key for the selected verifier\n  `
  )
  process.exit(1)
}

// Parse CLI arguments for verifier and API key.
if (process.argv.length < 4) usage()
const VERIFIER = process.argv[2]
const API_KEY = process.argv[3]

// Only allow supported verifiers. Add more here if you support new ones.
if (!["etherscan", "oklink"].includes(VERIFIER)) usage()

// Read and parse the contracts.json file. Ensure it is up to date with deployments.
const contracts: Array<{
  chain: string
  dcaOrder: string
  orderFactory: string
}> = JSON.parse(fs.readFileSync(CONTRACTS_PATH, "utf8"))

// Main verification loop: iterates over each chain and contract type.
for (const entry of contracts) {
  const { chain, dcaOrder, orderFactory } = entry
  const info = CHAIN_INFO[chain]
  if (!info) {
    // Warn if a chain is not configured in CHAIN_INFO.
    continue
  }

  // For each contract type, build and run the verification command.
  for (const [name, address] of Object.entries({
    DCAOrder: dcaOrder,
    OrderFactory: orderFactory
  })) {
    if (!address) continue // Skip if no address is present for this contract type.
    let cmd = `forge verify-contract ${address} ${CONTRACTS_SRC[name]}`
    if (VERIFIER === "etherscan") {
      // Etherscan verification: requires chainId and etherscan API key.
      cmd += ` --chain-id ${info.chainId} --etherscan-api-key ${API_KEY}`
    } else if (VERIFIER === "oklink") {
      // Oklink verification: requires custom verifier and URL.
      cmd += ` --verifier oklink --verifier-url ${info.oklinkUrl} --api-key ${API_KEY}`
    }
    console.log(`\nVerifying ${name} on ${chain}:\n${cmd}`)
    try {
      // Run the verification command. Errors are caught and logged below.
      execSync(cmd, { stdio: "inherit" })
    } catch (e) {
      // Log verification failures but continue with the next contract.
      console.error(`Verification failed for ${name} on ${chain}`)
    }
  }
}
