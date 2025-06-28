import {
  arbitrumTokens,
  avalancheTokens,
  baseTokens,
  gnosisTokens,
  mainnetTokens,
  TokenFromTokenlist
} from "@/models/token"
import { ChainId } from "@useolive/sdk"

interface DefaultTokens {
  from: TokenFromTokenlist
  to: TokenFromTokenlist
}

export const DEFAULT_TOKENS_BY_CHAIN: { [chainId: number]: DefaultTokens } = {
  [ChainId.ETHEREUM]: {
    from: mainnetTokens.USDC,
    to: mainnetTokens.WETH
  },
  [ChainId.ARBITRUM]: {
    from: arbitrumTokens.USDC,
    to: arbitrumTokens.WETH
  },
  [ChainId.BASE]: {
    from: baseTokens.USDC,
    to: baseTokens.WETH
  },
  [ChainId.GNOSIS]: {
    from: gnosisTokens.USDC,
    to: gnosisTokens.WETH
  },
  [ChainId.AVALANCHE]: {
    from: avalancheTokens.USDC,
    to: avalancheTokens.DAI
  }
}
