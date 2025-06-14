import { ChainId } from "@useolive/sdk"

const COW_API_BASE_URL = "https://api.cow.fi"
const DEV_COW_API_BASE_URL = "https://barn.api.cow.fi"
const API_VERSION_PATH = "api/v1"

export const COW_API_URL: Readonly<Record<ChainId, string>> = {
  // [ChainId.ETHEREUM]: `${COW_API_BASE_URL}/mainnet/${API_VERSION_PATH}`,
  [ChainId.ARBITRUM]: `${COW_API_BASE_URL}/arbitrum_one/${API_VERSION_PATH}`,
  [ChainId.POLYGON]: `${DEV_COW_API_BASE_URL}/polygon/${API_VERSION_PATH}`,
  [ChainId.BASE]: `${COW_API_BASE_URL}/base/${API_VERSION_PATH}`,
  [ChainId.GNOSIS]: `${COW_API_BASE_URL}/xdai/${API_VERSION_PATH}`
}

const COW_EXPLORER_BASE_URL = "https://explorer.cow.fi"
const ORDERS_PATH = "orders"

export const COW_API_EXPLORER_URL: Readonly<Record<ChainId, string>> = {
  // [ChainId.ETHEREUM]: `${COW_EXPLORER_BASE_URL}/${ORDERS_PATH}/`,
  [ChainId.ARBITRUM]: `${COW_EXPLORER_BASE_URL}/arb1/${ORDERS_PATH}/`,
  [ChainId.POLYGON]: `${COW_EXPLORER_BASE_URL}/pol/${ORDERS_PATH}/`,
  [ChainId.BASE]: `${COW_EXPLORER_BASE_URL}/base/${ORDERS_PATH}/`,
  [ChainId.GNOSIS]: `${COW_EXPLORER_BASE_URL}/gc/${ORDERS_PATH}/`
}

export const cowExplorerUrl = (chainId: ChainId, uid: string) =>
  COW_API_EXPLORER_URL[chainId] + uid
