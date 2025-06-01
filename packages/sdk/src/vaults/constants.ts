import { AddressZero } from "@ethersproject/constants"
import { ChainId } from "../constants"

export const MAINNET_ORDER_FACTORY_ADDRESS =
  "0x0000000000000000000000000000000000000000"
// export const POLYGON_ORDER_FACTORY_ADDRESS =
//   "0xddBa1edcd5e0735bdF00C063a397B0580d48acB5"
export const ARBITRUM_ORDER_FACTORY_ADDRESS =
  "0xdbc1c767C6C8ea9455AE29Bf0b10b18AF00EeE35"
export const BASE_ORDER_FACTORY_ADDRESS =
  "0x14b4Bc25e5AcA0FdF048C7Cc93bb26513491e4d8"
export const GNOSIS_ORDER_FACTORY_ADDRESS =
  "0x04d420c7f865869835267ebd2C99a1F2daFF9482"

export const MAINNET_DCAORDER_ADDRESS =
  "0x0000000000000000000000000000000000000000"
// export const POLYGON_DCAORDER_ADDRESS =
//   "0x85d638DeD1703D67EA42eA7Ea4686CB7069c96e0"
export const ARBITRUM_DCAORDER_ADDRESS =
  "0x4dF72d4C6196e330Ee3F451734C6FFefAD711985"
export const BASE_DCAORDER_ADDRESS =
  "0x710f79CF66106E773D9FE61010d53222b7be9BBf"
export const GNOSIS_DCAORDER_ADDRESS =
  "0x33ca2aAB1fF8B9F585E5Af4a31FB06F5Ea03500c"

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
 * Olive's Order factory address list
 */
export const ORDER_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: MAINNET_ORDER_FACTORY_ADDRESS,
  // [ChainId.POLYGON]: POLYGON_ORDER_FACTORY_ADDRESS,
  [ChainId.ARBITRUM]: ARBITRUM_ORDER_FACTORY_ADDRESS,
  [ChainId.BASE]: BASE_ORDER_FACTORY_ADDRESS,
  [ChainId.GNOSIS]: GNOSIS_ORDER_FACTORY_ADDRESS
}

/**
 * Olive's DCA Order singleton/mastercopy address list
 */
export const DCAORDER_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: MAINNET_DCAORDER_ADDRESS,
  // [ChainId.POLYGON]: POLYGON_DCAORDER_ADDRESS,
  [ChainId.ARBITRUM]: ARBITRUM_DCAORDER_ADDRESS,
  [ChainId.BASE]: BASE_DCAORDER_ADDRESS,
  [ChainId.GNOSIS]: GNOSIS_DCAORDER_ADDRESS
}

/**
 * CoW's settlement address list
 * @see https://docs.cow.fi/smart-contracts/introduction
 * to check CoW contracts addresses
 */

// GPv2Settlement
const COW_SETTLEMENT_ADDRESS = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41"

export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: COW_SETTLEMENT_ADDRESS,
  // [ChainId.POLYGON]: COW_SETTLEMENT_ADDRESS,
  [ChainId.ARBITRUM]: COW_SETTLEMENT_ADDRESS,
  [ChainId.BASE]: COW_SETTLEMENT_ADDRESS,
  [ChainId.GNOSIS]: COW_SETTLEMENT_ADDRESS
}

const ETHEREUM_SUBGRAPH_ENDPOINT_URL =
  process.env.ETHEREUM_SUBGRAPH_API_URL ?? ""
// const POLYGON_SUBGRAPH_ENDPOINT_URL = process.env.POLYGON_SUBGRAPH_API_URL ?? ""
const ARBITRUM_SUBGRAPH_ENDPOINT_URL =
  process.env.ARBITRUM_SUBGRAPH_API_URL ?? ""
const BASE_SUBGRAPH_ENDPOINT_URL = process.env.BASE_SUBGRAPH_API_URL ?? ""
const GNOSIS_SUBGRAPH_ENDPOINT_URL = process.env.GNOSIS_SUBGRAPH_API_URL ?? ""

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<ChainId, string>> = {
  [ChainId.ETHEREUM]: ETHEREUM_SUBGRAPH_ENDPOINT_URL,
  // [ChainId.POLYGON]: POLYGON_SUBGRAPH_ENDPOINT_URL,
  [ChainId.ARBITRUM]: ARBITRUM_SUBGRAPH_ENDPOINT_URL,
  [ChainId.BASE]: BASE_SUBGRAPH_ENDPOINT_URL,
  [ChainId.GNOSIS]: GNOSIS_SUBGRAPH_ENDPOINT_URL
}

/**
 * Returns the address of the order factory for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getOrderFactoryAddress(chainId: ChainId): string {
  return validateVaultInfo(chainId, ORDER_FACTORY_ADDRESS_LIST, "Order factory")
}

/**
 * Gets the address of the order singleton for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getDCAOrderSingletonAddress(chainId: ChainId): string {
  return validateVaultInfo(
    chainId,
    DCAORDER_SINGLETON_ADDRESS_LIST,
    "DCAOrder singleton"
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
