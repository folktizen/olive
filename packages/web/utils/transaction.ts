import { ChainId } from "@useolive/sdk"

const EXPLORER_URL_BY_CHAIN = {
  [ChainId.ETHEREUM]: "https://etherscan.io",
  [ChainId.ARBITRUM]: "https://arbiscan.io",
  [ChainId.BASE]: "https://basescan.org",
  [ChainId.GNOSIS]: "https://gnosisscan.io",
  [ChainId.POLYGON]: "https://polygonscan.com",
  [ChainId.AVALANCHE]: "https://snowscan.xyz"
}

export const getExplorerLink = (
  chainId: ChainId,
  subPath: string,
  path: "tx" | "address",
  fragment?: string
) => {
  const baseUrl = EXPLORER_URL_BY_CHAIN[chainId]

  return `${baseUrl}/${path}/${subPath}${fragment ?? ""}`
}
