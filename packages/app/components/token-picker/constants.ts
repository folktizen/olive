import {
  // mainnetTokens,
  arbitrumTokens,
  baseTokens,
  gnosisTokens,
  polygonTokens,
  TokenFromTokenlist
} from "@/models/token"
import { ChainId } from "@useolive/sdk"

export const TOKEN_PICKER_COMMON_TOKENS: {
  [chainId: number]: TokenFromTokenlist[]
} = {
  // [ChainId.ETHEREUM]: [
  //   mainnetTokens.USDC,
  //   mainnetTokens.WETH,
  //   mainnetTokens.WBTC
  // ],
  [ChainId.ARBITRUM]: [
    arbitrumTokens.USDC,
    arbitrumTokens.WETH,
    arbitrumTokens.WBTC,
    arbitrumTokens.ARB
  ],
  [ChainId.POLYGON]: [
    polygonTokens.USDC,
    polygonTokens.WPOL,
    polygonTokens.WETH,
    polygonTokens.WBTC
  ],
  [ChainId.BASE]: [baseTokens.USDC, baseTokens.WETH, baseTokens.CBBTC],
  [ChainId.GNOSIS]: [
    gnosisTokens.USDC,
    gnosisTokens.GNO,
    gnosisTokens.WETH,
    gnosisTokens.WXDAI
  ]
}
