import { AddressZero } from "@ethersproject/constants"
import { ChainId } from "../constants"

// export const MAINNET_TRADE_FOUNDRY_ADDRESS =
//   "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54"
// export const POLYGON_TRADE_FOUNDRY_ADDRESS =
//   "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54"
export const ARBITRUM_TRADE_FOUNDRY_ADDRESS =
  "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54"
export const BASE_TRADE_FOUNDRY_ADDRESS =
  "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54"
export const GNOSIS_TRADE_FOUNDRY_ADDRESS =
  "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54"

// export const MAINNET_DCAFARM_ADDRESS =
//   "0x5dE0A3F1e2C4c640c5AB30703E15841f1A971240"
// export const POLYGON_DCAFARM_ADDRESS =
//   "0x5dE0A3F1e2C4c640c5AB30703E15841f1A971240"
export const ARBITRUM_DCAFARM_ADDRESS =
  "0x5dE0A3F1e2C4c640c5AB30703E15841f1A971240"
export const BASE_DCAFARM_ADDRESS = "0x5dE0A3F1e2C4c640c5AB30703E15841f1A971240"
export const GNOSIS_DCAFARM_ADDRESS =
  "0x5dE0A3F1e2C4c640c5AB30703E15841f1A971240"

const validateVaultInfo = (
  chainId: ChainId,
  map: Record<ChainId, string> | Readonly<Record<string, string>>,
  mapName: string
) => {
  const address = map[chainId]
  if (!address || address === AddressZero) {
    throw new Error(`${mapName} is not deployed on chain ${chainId}`)
  }

  return address
}

/**
 * Olive's Order foundry address list
 */
export const TRADE_FOUNDRY_ADDRESS_LIST: Record<ChainId, string> = {
  // [ChainId.ETHEREUM]: MAINNET_TRADE_FOUNDRY_ADDRESS,
  // [ChainId.POLYGON]: POLYGON_TRADE_FOUNDRY_ADDRESS,
  [ChainId.ARBITRUM]: ARBITRUM_TRADE_FOUNDRY_ADDRESS,
  [ChainId.BASE]: BASE_TRADE_FOUNDRY_ADDRESS,
  [ChainId.GNOSIS]: GNOSIS_TRADE_FOUNDRY_ADDRESS
}

/**
 * Olive's DCA Farm singleton/mastercopy address list
 */
export const DCAFARM_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  // [ChainId.ETHEREUM]: MAINNET_DCAFARM_ADDRESS,
  // [ChainId.POLYGON]: POLYGON_DCAFARM_ADDRESS,
  [ChainId.ARBITRUM]: ARBITRUM_DCAFARM_ADDRESS,
  [ChainId.BASE]: BASE_DCAFARM_ADDRESS,
  [ChainId.GNOSIS]: GNOSIS_DCAFARM_ADDRESS
}

/**
 * CoW's settlement address list
 * @see https://docs.cow.fi/smart-contracts/introduction
 * to check CoW contracts addresses
 */

// GPv2Settlement
const COW_SETTLEMENT_ADDRESS = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41"

export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  // [ChainId.ETHEREUM]: COW_SETTLEMENT_ADDRESS,
  // [ChainId.POLYGON]: COW_SETTLEMENT_ADDRESS,
  [ChainId.ARBITRUM]: COW_SETTLEMENT_ADDRESS,
  [ChainId.BASE]: COW_SETTLEMENT_ADDRESS,
  [ChainId.GNOSIS]: COW_SETTLEMENT_ADDRESS
}

const THEGRAPH_API_BASE_URL =
  "https://gateway-arbitrum.network.thegraph.com/api"
const GOLDSKY_API_BASE_URL = "https://api.goldsky.com/api/public"

const THEGRAPH_API_KEY =
  process.env.OLIVE_THEGRAPH_API_KEY ?? "a5be5b982b0198a9e5f7b005a9eee7a6"
const GOLDSKY_PROJECT_ID =
  process.env.OLIVE_GOLDSKY_PROJECT_ID ?? "project_clphol9357ef601utg9cgegtg"

// const ETHEREUM_SUBGRAPH_ENDPOINT_URL =
//   process.env.ETHEREUM_SUBGRAPH_API_URL ??
//   `${THEGRAPH_API_BASE_URL}/${THEGRAPH_API_KEY}/subgraphs/id/35bL4ohk2tnXqDnrp7NSyAKW8bbUmGDapyfe2ddCxV8H`
// const POLYGON_SUBGRAPH_ENDPOINT_URL =
//   process.env.POLYGON_SUBGRAPH_API_URL ??
//   `${THEGRAPH_API_BASE_URL}/${THEGRAPH_API_KEY}/subgraphs/id/7pEwWh39RCYcZPY2az5EWfYJ9Zkasn4bCC4Dc15qEaaj`
const ARBITRUM_SUBGRAPH_ENDPOINT_URL =
  process.env.ARBITRUM_SUBGRAPH_API_URL ??
  `${THEGRAPH_API_BASE_URL}/${THEGRAPH_API_KEY}/subgraphs/id/3HQAS3YAKUHFTiBdKuuQCTR8uyvaA7rDnEYcRNS5RZGP`
const BASE_SUBGRAPH_ENDPOINT_URL =
  process.env.BASE_SUBGRAPH_API_URL ??
  `${THEGRAPH_API_BASE_URL}/${THEGRAPH_API_KEY}/subgraphs/id/GG4e2XbzE99BGMGmPzBz5p6KkHndRtpEu9nFiiJjvoCY`
const GNOSIS_SUBGRAPH_ENDPOINT_URL =
  process.env.GNOSIS_SUBGRAPH_API_URL ??
  `${THEGRAPH_API_BASE_URL}/${THEGRAPH_API_KEY}/subgraphs/id/3EMgJeaUuRrKSSy1NHdCw4p1ytgRbgWRQBkqqbKHxJ4U`

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<ChainId, string>> = {
  // [ChainId.ETHEREUM]: ETHEREUM_SUBGRAPH_ENDPOINT_URL,
  // [ChainId.POLYGON]: POLYGON_SUBGRAPH_ENDPOINT_URL,
  [ChainId.ARBITRUM]: ARBITRUM_SUBGRAPH_ENDPOINT_URL,
  [ChainId.BASE]: BASE_SUBGRAPH_ENDPOINT_URL,
  [ChainId.GNOSIS]: GNOSIS_SUBGRAPH_ENDPOINT_URL
}

/**
 * Returns the address of the order foundry for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getTradeFoundryAddress(chainId: ChainId): string {
  return validateVaultInfo(chainId, TRADE_FOUNDRY_ADDRESS_LIST, "Order foundry")
}

/**
 * Gets the address of the order singleton for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getDCAFarmSingletonAddress(chainId: ChainId): string {
  return validateVaultInfo(
    chainId,
    DCAFARM_SINGLETON_ADDRESS_LIST,
    "DCAFarm singleton"
  )
}

/**
 * Gets the address of the settlement contract for a given chain id
 * @param chainId The chain id
 * @returns The address of the settlement contract
 */
export function getCOWProtocolSettlementAddress(chainId: ChainId): string {
  return validateVaultInfo(
    chainId,
    COW_SETTLEMENT_ADDRESS_LIST,
    "CoW Settlement"
  )
}

/**
 * Get the subgraph endpoint for a chainId
 * @param chainId - Chain ID
 * @returns Subgraph endpoint
 * @throws Error if no subgraph endpoint is found for the chainId
 */
export function getSubgraphEndpoint(chainId: ChainId) {
  return validateVaultInfo(chainId, SUBGRAPH_ENDPOINT_LIST, "Subraph Endpoint")
}

/**
 * DCA Frequency interval. How often the order will be placed.
 */
export enum DCAFrequencyInterval {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month"
}
