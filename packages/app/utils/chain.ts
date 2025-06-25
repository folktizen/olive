import { ChainId } from "@useolive/sdk"

export const checkIsValidChainId = (newChainId: number): Boolean =>
  Object.values(ChainId).some((chainId) => chainId === newChainId)
