import {
  arbitrumTokens,
  avalancheTokens,
  baseTokens,
  gnosisTokens,
  mainnetTokens,
  polygonTokens,
  TokenFromTokenlist
} from "@/models/token"
import { ChainId } from "@useolive/sdk"

export const TOKEN_PICKER_COMMON_TOKENS: {
  [chainId: number]: TokenFromTokenlist[]
} = {
  [ChainId.ETHEREUM]: [
    mainnetTokens.USDC,
    mainnetTokens.WETH,
    mainnetTokens.WBTC
  ],
  [ChainId.ARBITRUM]: [
    arbitrumTokens.USDC,
    arbitrumTokens.WETH,
    arbitrumTokens.WBTC,
    arbitrumTokens.ARB
  ],
  [ChainId.BASE]: [baseTokens.USDC, baseTokens.WETH, baseTokens.CBBTC],
  [ChainId.GNOSIS]: [gnosisTokens.GNO, gnosisTokens.WETH, gnosisTokens.WXDAI],
  [ChainId.POLYGON]: [
    polygonTokens.USDC,
    polygonTokens.WETH,
    polygonTokens.WBTC,
    polygonTokens.WPOL
  ],
  [ChainId.AVALANCHE]: [
    avalancheTokens.USDC,
    avalancheTokens.WBTC,
    avalancheTokens.DAI,
    avalancheTokens.WAVAX
  ]
}
