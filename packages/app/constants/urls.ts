import { ChainId } from "@useolive/sdk"

// RPC endpoints
export const RPC_LIST: { [chainId: number]: string } = {
  // [ChainId.ETHEREUM]:
  //   process.env.RPC_MAINNET ??
  //   "https://eth-mainnet.g.alchemy.com/v2/IlaAR90kaQ_mQ6FyLZhud-GYFNFsm7_t",
  [ChainId.ARBITRUM]:
    process.env.RPC_ARBITRUM ??
    "https://arb-mainnet.g.alchemy.com/v2/IlaAR90kaQ_mQ6FyLZhud-GYFNFsm7_t",
  [ChainId.POLYGON]:
    process.env.RPC_POLYGON ??
    "https://polygon-mainnet.g.alchemy.com/v2/IlaAR90kaQ_mQ6FyLZhud-GYFNFsm7_t",
  [ChainId.BASE]:
    process.env.RPC_BASE ??
    "https://base-mainnet.g.alchemy.com/v2/IlaAR90kaQ_mQ6FyLZhud-GYFNFsm7_t",
  [ChainId.GNOSIS]:
    process.env.RPC_GNOSIS ??
    "https://gnosis-mainnet.g.alchemy.com/v2/IlaAR90kaQ_mQ6FyLZhud-GYFNFsm7_t"
}

// App URLs
export const FOLKTIZEN_URL =
  process.env.FOLKTIZEN_URL ?? "https://folktizen.xyz"

export const OLIVE_APP_URL =
  process.env.OLIVE_APP_URL ?? "https://useolive.space"
