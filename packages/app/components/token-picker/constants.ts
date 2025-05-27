import { arbitrumTokens, baseTokens, TokenFromTokenlist } from "@/models/token"
import { ChainId } from "@useolive/sdk"

export const TOKEN_PICKER_COMMON_TOKENS: {
  [chainId: number]: TokenFromTokenlist[]
} = {
  // [ChainId.ETHEREUM]: [
  //   mainnetTokens.USDC,
  //   mainnetTokens.WETH,
  //   mainnetTokens.WBTC,
  //   mainnetTokens.SWPR
  // ],
  [ChainId.ARBITRUM]: [
    arbitrumTokens.USDC,
    arbitrumTokens.WETH,
    arbitrumTokens.WBTC,
    arbitrumTokens.ARB,
    arbitrumTokens.SWPR
  ],
  [ChainId.BASE]: [baseTokens.USDC, baseTokens.WETH, baseTokens.CBBTC]
}
