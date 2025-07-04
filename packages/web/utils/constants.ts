import {
  arbitrumTokens,
  // avalancheTokens,
  baseTokens,
  gnosisTokens,
  mainnetTokens,
  // polygonTokens,
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
  }
  // [ChainId.POLYGON]: {
  //   from: polygonTokens.USDC,
  //   to: polygonTokens.WPOL
  // },
  // [ChainId.AVALANCHE]: {
  //   from: avalancheTokens.USDC,
  //   to: avalancheTokens.WAVAX
  // }
}
