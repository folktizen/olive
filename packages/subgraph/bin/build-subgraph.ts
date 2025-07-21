import { writeFile } from "fs/promises"
import { stringify as yamlStringify } from "yaml"

import { config } from "./config"

/**
 * @see https://thegraph.com/docs/en/developing/supported-networks/
 * for supported chain names
 */
const SUPPORTED_NETWORKS = [
  "mainnet",
  "matic",
  "arbitrum-one",
  "base",
  "gnosis",
  "avalanche"
]

async function main() {
  // get network from command line
  const network = process.argv[2] as string | undefined
  // validate network
  if (!network || !SUPPORTED_NETWORKS.includes(network)) {
    throw new Error(
      `Invalid network. Must be one of: ${SUPPORTED_NETWORKS.join(", ")}`
    )
  }

  const subgraph = {
    specVersion: "0.0.4",
    features: ["nonFatalErrors"],
    schema: {
      file: "./schema.graphql"
    },
    dataSources: [
      {
        name: "TradeFoundry",
        kind: "ethereum/contract",
        network,
        source: {
          address: config[network].tradeFoundry.address,
          startBlock: config[network].tradeFoundry.startBlock,
          abi: "TradeFoundry"
        },
        mapping: {
          kind: "ethereum/events",
          apiVersion: "0.0.6",
          language: "wasm/assemblyscript",
          file: "./src/mappings/foundry.ts",
          entities: ["TradeFoundry"],
          abis: [
            {
              name: "TradeFoundry",
              file: "./abis/TradeFoundry.json"
            }
          ],
          eventHandlers: [
            {
              event: "OrderCreated(indexed address)",
              handler: "handleDCAFarmCreated"
            }
          ]
        }
      }
    ],
    templates: [
      {
        name: "DCAFarm",
        kind: "ethereum/contract",
        network,
        source: {
          abi: "DCAFarm"
        },
        mapping: {
          kind: "ethereum/events",
          apiVersion: "0.0.6",
          language: "wasm/assemblyscript",
          file: "./src/mappings/order.ts",
          entities: ["Order", "Token"],
          abis: [
            {
              name: "DCAFarm",
              file: "./abis/DCAFarm.json"
            },
            {
              name: "ERC20",
              file: "./abis/ERC20.json"
            },
            {
              name: "TradeFoundry",
              file: "./abis/TradeFoundry.json"
            }
          ],
          eventHandlers: [
            {
              event: "Initialized(indexed address)",
              handler: "handleDCAFarmInitialized"
            },
            {
              event: "Cancelled(indexed address)",
              handler: "handleDCAFarmCancelled"
            }
          ]
        }
      }
    ]
  }

  await writeFile(`./subgraph.yaml`, yamlStringify(subgraph))
}

main()
