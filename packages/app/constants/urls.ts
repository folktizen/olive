import { ChainId } from "@useolive/sdk"

// RPC endpoints
export const RPC_LIST: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: process.env.RPC_MAINNET ?? "https://eth.meowrpc.com/",
  [ChainId.GNOSIS]: process.env.RPC_GNOSIS ?? "https://rpc.gnosis.gateway.fm/",
  [ChainId.ARBITRUM]:
    process.env.RPC_ARBITRUM ?? "https://arbitrum-one-rpc.publicnode.com/",
  [ChainId.BASE]: process.env.RPC_BASE ?? "https://base-rpc.publicnode.com"
}

// App URLs
export const FOLKTIZEN_URL =
  process.env.FOLKTIZEN_URL ?? "https://folktizen.xyz"

export const OLIVE_APP_URL =
  process.env.OLIVE_APP_URL ?? "https://useolive.space"
