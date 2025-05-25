import { AddressZero } from "@ethersproject/constants";
import { ChainId } from "../constants";

export const ORDER_FACTORY_ADDRESS =
  "0xf754a9e276F4f1D385e9515Ec8bEbf6c00C0BB0A";
export const DCA_ORDER_ADDRESS = "0xe5cb3383c1f550b799EFa647297DA5D2fAf28244";

const validateVaultInfo = (
  chainId: ChainId,
  map: Record<ChainId, string> | Readonly<Record<string, string>>,
  mapName: string
) => {
  const address = map[chainId];
  if (!address || address === AddressZero) {
    throw new Error(`${mapName} is not deployed on chain ${chainId}`);
  }

  return address;
};

/**
 * Stackly's Order factory address list
 */
export const ORDER_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.OPTIMISM]: ORDER_FACTORY_ADDRESS,
  [ChainId.ARBITRUM]: ORDER_FACTORY_ADDRESS,
  [ChainId.POLYGON]: ORDER_FACTORY_ADDRESS,
  [ChainId.BASE]: ORDER_FACTORY_ADDRESS,
};

/**
 * Stackly's DCA Order singleton/mastercopy address list
 */
export const DCAORDER_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.OPTIMISM]: DCA_ORDER_ADDRESS,
  [ChainId.ARBITRUM]: DCA_ORDER_ADDRESS,
  [ChainId.POLYGON]: DCA_ORDER_ADDRESS,
  [ChainId.BASE]: DCA_ORDER_ADDRESS,
};

/**
 * CoW's settlement address list
 * @see https://docs.cow.fi/smart-contracts/introduction
 * to check CoW contracts addresses
 */

// GPv2Settlement
const COW_SETTLEMENT_ADDRESS = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";

export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.OPTIMISM]: COW_SETTLEMENT_ADDRESS,
  [ChainId.ARBITRUM]: COW_SETTLEMENT_ADDRESS,
  [ChainId.POLYGON]: COW_SETTLEMENT_ADDRESS,
  [ChainId.BASE]: COW_SETTLEMENT_ADDRESS,
};

const OPTIMISM_SUBGRAPH_ENDPOINT_URL = process.env.OPTIMISM_SUBGRAPH_API_URL;
const ARBITRUM_SUBGRAPH_ENDPOINT_URL = process.env.ARBITRUM_SUBGRAPH_API_URL;
const POLYGON_SUBGRAPH_ENDPOINT_URL = process.env.POLYGON_SUBGRAPH_API_URL;
const BASE_SUBGRAPH_ENDPOINT_URL = process.env.BASE_SUBGRAPH_API_URL;

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<string, string>> = {
  [ChainId.OPTIMISM]: OPTIMISM_SUBGRAPH_ENDPOINT_URL,
  [ChainId.ARBITRUM]: ARBITRUM_SUBGRAPH_ENDPOINT_URL,
  [ChainId.POLYGON]: POLYGON_SUBGRAPH_ENDPOINT_URL,
  [ChainId.BASE]: BASE_SUBGRAPH_ENDPOINT_URL,
};

/**
 * Returns the address of the order factory for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getOrderFactoryAddress(chainId: ChainId): string {
  return validateVaultInfo(
    chainId,
    ORDER_FACTORY_ADDRESS_LIST,
    "Order factory"
  );
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
  );
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
  );
}

/**
 * Get the subgraph endpoint for a chainId
 * @param chainId - Chain ID
 * @returns Subgraph endpoint
 * @throws Error if no subgraph endpoint is found for the chainId
 */
export function getSubgraphEndpoint(chainId: ChainId) {
  return validateVaultInfo(chainId, SUBGRAPH_ENDPOINT_LIST, "Subraph Endpoint");
}

/**
 * DCA Frequency interval. How often the order will be placed.
 */
export enum DCAFrequencyInterval {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}
