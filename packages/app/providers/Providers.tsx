"use client"

import { PropsWithChildren } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { WagmiProvider } from "wagmi"

import {
  FarmboxFormContextProvider,
  ModalContextProvider,
  NetworkContextProvider,
  StrategyContextProvider,
  TokenListProvider
} from "@/contexts"
import { config } from "./wagmi-config"

const queryClient = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="rounded"
          options={{ initialChainId: 0, enforceSupportedChains: true }}
        >
          <NetworkContextProvider>
            <TokenListProvider>
              <ModalContextProvider>
                <StrategyContextProvider>
                  <FarmboxFormContextProvider>
                    {children}
                  </FarmboxFormContextProvider>
                </StrategyContextProvider>
              </ModalContextProvider>
            </TokenListProvider>
          </NetworkContextProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
