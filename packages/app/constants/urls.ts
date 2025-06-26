import { ChainId } from "@useolive/sdk"

// RPC endpoints
export const RPC_LIST: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]:
    process.env.RPC_MAINNET ??
    "https://lb.drpc.org/ogrpc?network=ethereum&dkey=AgHOr1Xt1kcjg0A00rv_wCJtxL6IUh4R8JM4rqRhf0fE",
  [ChainId.ARBITRUM]:
    process.env.RPC_ARBITRUM ??
    "https://lb.drpc.org/ogrpc?network=arbitrum&dkey=AgHOr1Xt1kcjg0A00rv_wCJtxL6IUh4R8JM4rqRhf0fE",
  [ChainId.BASE]:
    process.env.RPC_BASE ??
    "https://lb.drpc.org/ogrpc?network=base&dkey=AgHOr1Xt1kcjg0A00rv_wCJtxL6IUh4R8JM4rqRhf0fE",
  [ChainId.GNOSIS]:
    process.env.RPC_GNOSIS ??
    "https://lb.drpc.org/ogrpc?network=gnosis&dkey=AgHOr1Xt1kcjg0A00rv_wCJtxL6IUh4R8JM4rqRhf0fE",
  [ChainId.AVALANCHE]:
    process.env.RPC_AVALANCHE ??
    "https://lb.drpc.org/ogrpc?network=avalanche&dkey=AgHOr1Xt1kcjg0A00rv_wCJtxL6IUh4R8JM4rqRhf0fE"
}

// App URLs
export const FOLKTIZEN_URL =
  process.env.FOLKTIZEN_URL ?? "https://folktizen.xyz"

export const OLIVE_APP_URL =
  process.env.OLIVE_APP_URL ?? "https://useolive.space"
