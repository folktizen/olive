import { FREQUENCY_OPTIONS } from "@/models/stack"
import {
  gnosisTokens,
  mainnetTokens,
  arbitrumTokens,
  baseTokens
} from "@/models/token"
import { Strategy } from "@/contexts"
import { ChainId } from "@useolive/sdk"

type ChainStrategy = {
  label: string
  strategies: Strategy[]
}

type ChainStrategies = {
  popular: ChainStrategy
}

export const FREQUENCY_LABEL = {
  [FREQUENCY_OPTIONS.hour]: "hourly",
  [FREQUENCY_OPTIONS.day]: "daily",
  [FREQUENCY_OPTIONS.week]: "weekly",
  [FREQUENCY_OPTIONS.month]: "monthly"
}

export const STRATEGY_CATEGORIES: { [chainId: number]: ChainStrategies } = {
  [ChainId.ETHEREUM]: {
    popular: {
      label: "Popular Strategies",
      strategies: [
        {
          id: 1,
          buyToken: mainnetTokens.WETH,
          daysAmount: 60,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 0.0075,
          sellToken: mainnetTokens.WBTC,
          totalSellAmount: "0.45"
        },
        {
          id: 2,
          buyToken: mainnetTokens.WBTC,
          daysAmount: 80,
          frequency: FREQUENCY_OPTIONS.week,
          sellAmountPerTimeframe: 0.0625,
          sellToken: mainnetTokens.WETH,
          totalSellAmount: "5"
        },
        {
          id: 3,
          buyToken: mainnetTokens.WETH,
          daysAmount: 120,
          frequency: FREQUENCY_OPTIONS.month,
          sellAmountPerTimeframe: 2000,
          sellToken: mainnetTokens.USDC,
          totalSellAmount: "8000"
        },
        {
          id: 4,
          buyToken: mainnetTokens.DAI,
          daysAmount: 50,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 0.02,
          sellToken: mainnetTokens.WETH,
          totalSellAmount: "1"
        }
      ]
    }
  },
  [ChainId.GNOSIS]: {
    popular: {
      label: "Popular Strategies",
      strategies: [
        {
          id: 1,
          buyToken: gnosisTokens.WETH,
          daysAmount: 30,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 50,
          sellToken: gnosisTokens.USDC,
          totalSellAmount: "1500"
        },
        {
          id: 2,
          buyToken: gnosisTokens.GNO,
          daysAmount: 7,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 20,
          sellToken: gnosisTokens.WXDAI,
          totalSellAmount: "140"
        },
        {
          id: 3,
          buyToken: gnosisTokens.WETH,
          daysAmount: 4,
          frequency: FREQUENCY_OPTIONS.hour,
          sellAmountPerTimeframe: 5,
          sellToken: gnosisTokens.USDC,
          totalSellAmount: "480"
        },
        {
          id: 4,
          buyToken: gnosisTokens.WBTC,
          daysAmount: 56,
          frequency: FREQUENCY_OPTIONS.week,
          sellAmountPerTimeframe: 100,
          sellToken: gnosisTokens.WXDAI,
          totalSellAmount: "800"
        }
      ]
    }
  },
  [ChainId.ARBITRUM]: {
    popular: {
      label: "Popular Strategies",
      strategies: [
        {
          id: 1,
          buyToken: arbitrumTokens.WETH,
          daysAmount: 30,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 50,
          sellToken: arbitrumTokens.USDC,
          totalSellAmount: "1500"
        },
        {
          id: 2,
          buyToken: arbitrumTokens.ARB,
          daysAmount: 7,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 20,
          sellToken: arbitrumTokens.DAI,
          totalSellAmount: "140"
        },
        {
          id: 3,
          buyToken: arbitrumTokens.WETH,
          daysAmount: 4,
          frequency: FREQUENCY_OPTIONS.hour,
          sellAmountPerTimeframe: 5,
          sellToken: arbitrumTokens.USDC,
          totalSellAmount: "480"
        },
        {
          id: 4,
          buyToken: arbitrumTokens.WBTC,
          daysAmount: 56,
          frequency: FREQUENCY_OPTIONS.week,
          sellAmountPerTimeframe: 100,
          sellToken: arbitrumTokens.DAI,
          totalSellAmount: "800"
        }
      ]
    }
  },
  [ChainId.BASE]: {
    popular: {
      label: "Popular Strategies",
      strategies: [
        {
          id: 1,
          buyToken: baseTokens.CBETH,
          daysAmount: 14,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 100,
          sellToken: baseTokens.USDC,
          totalSellAmount: "1400"
        },
        {
          id: 2,
          buyToken: baseTokens.CBBTC,
          daysAmount: 182,
          frequency: FREQUENCY_OPTIONS.week,
          sellAmountPerTimeframe: 50,
          sellToken: baseTokens.USDC,
          totalSellAmount: "1300"
        },
        {
          id: 3,
          buyToken: baseTokens.VIRTUAL,
          daysAmount: 3,
          frequency: FREQUENCY_OPTIONS.hour,
          sellAmountPerTimeframe: 10,
          sellToken: baseTokens.WETH,
          totalSellAmount: "720"
        },
        {
          id: 4,
          buyToken: baseTokens.WETH,
          daysAmount: 30,
          frequency: FREQUENCY_OPTIONS.day,
          sellAmountPerTimeframe: 50,
          sellToken: baseTokens.USDC,
          totalSellAmount: "1500"
        }
      ]
    }
  }
}
