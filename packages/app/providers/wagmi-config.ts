import { ChainId } from "@useolive/sdk"
import { getDefaultConfig } from "connectkit"
import { createConfig, fallback, http } from "wagmi"
import {
  // mainnet,
  arbitrum,
  base
} from "wagmi/chains"
import { safe } from "wagmi/connectors"

import { RPC_LIST } from "@/constants"

const defaultConfig = getDefaultConfig({
  chains: [
    // mainnet,
    arbitrum,
    base
  ],
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  transports: {
    // [mainnet.id]: fallback([http(RPC_LIST[ChainId.ETHEREUM]), http()]),
    [arbitrum.id]: fallback([http(RPC_LIST[ChainId.ARBITRUM]), http()]),
    [base.id]: fallback([http(RPC_LIST[ChainId.BASE]), http()])
  },
  appName: "Olive",
  appDescription: "Empower your portfolio with DCA.",
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
