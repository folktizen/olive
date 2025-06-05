import {
  // mainnetTokens,
  arbitrumTokens,
  baseTokens,
  gnosisTokens,
  TokenFromTokenlist
} from "@/models/token"
import { ChainId } from "@useolive/sdk"

export const TOKEN_PICKER_COMMON_TOKENS: {
  [chainId: number]: TokenFromTokenlist[]
} = {
  // [ChainId.ETHEREUM]: [
  //   mainnetTokens.USDC,
  //   mainnetTokens.WETH,
  //   mainnetTokens.WBTC,
  //   mainnetTokens.USD0
  // ],
  [ChainId.ARBITRUM]: [
    arbitrumTokens.USDC,
    arbitrumTokens.WETH,
    arbitrumTokens.WBTC,
    arbitrumTokens.ARB,
    arbitrumTokens.USD0
  ],
  [ChainId.BASE]: [
    baseTokens.USDC,
    baseTokens.WETH,
    baseTokens.CBBTC,
    baseTokens.USD0
  ],
  [ChainId.GNOSIS]: [
    gnosisTokens.USDC,
    gnosisTokens.GNO,
    gnosisTokens.WETH,
    gnosisTokens.WXDAI
  ]
}
