import { ChainId } from "@useolive/sdk"
import { getDefaultConfig } from "connectkit"
import { createConfig, fallback, http } from "wagmi"
import {
  // mainnet,
  arbitrum,
  base,
  gnosis
} from "wagmi/chains"
import { safe } from "wagmi/connectors"

import { RPC_LIST } from "@/constants"

const defaultConfig = getDefaultConfig({
  chains: [
    // mainnet,
    arbitrum,
    base,
    gnosis
  ],
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    "a726dd64b978014250465ce1eb8f3da3",
  transports: {
    // [mainnet.id]: fallback([http(RPC_LIST[ChainId.ETHEREUM]), http()]),
    [arbitrum.id]: fallback([http(RPC_LIST[ChainId.ARBITRUM]), http()]),
    [base.id]: fallback([http(RPC_LIST[ChainId.BASE]), http()]),
    [gnosis.id]: fallback([http(RPC_LIST[ChainId.GNOSIS]), http()])
  },
  appName: "Olive",
  appDescription:
    "Olive is a simple DCA (Dollar-Cost Averaging) tool that utilizes the CoW (Conditional Order Workflow) Protocol to place TWAP (Time-Weighted Average Price) orders.",
  appUrl: "https://useolive.space",
  appIcon: "https://useolive.space/favicon.ico",
  ssr: true
})

const safeConnector = safe({
  allowedDomains: [/app.safe.global$/],
  debug: false
})

export const config = createConfig({
  ...defaultConfig,
  connectors: defaultConfig.connectors
    ? defaultConfig.connectors
    : [safeConnector]
})
