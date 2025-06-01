"use client"

import { ChainId } from "@useolive/sdk"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react"
import type { Chain } from "viem/chains"
import { useAccount, useSwitchChain } from "wagmi"
import { arbitrum } from "wagmi/chains"

import { config } from "@/providers/wagmi-config"
import { checkIsValidChainId } from "@/utils"
import { useQueryState } from "next-usequerystate"

interface WagmiChain extends Chain {
  unsupported?: boolean
}

const throwNetworkContextError = () => {
  throw new Error("No NetworkContext available")
}

interface NetworkContextProps {
  chains?: readonly WagmiChain[]
  chainId: ChainId
  changeNetwork: (newChainId: ChainId) => void
  selectedChain: WagmiChain
  setChainId: React.Dispatch<React.SetStateAction<ChainId>>
}

const NetworkContext = createContext<NetworkContextProps>({
  chainId: arbitrum.id,
  changeNetwork: throwNetworkContextError,
  selectedChain: arbitrum,
  setChainId: throwNetworkContextError
})

interface NetworkContextProviderProps {
  children: ReactNode
}

const INVALID_CHAIN_ID = 0

export const NetworkContextProvider = ({
  children
}: NetworkContextProviderProps) => {
  const { chains } = config
  const { isConnected, chain } = useAccount()

  const [searchParamsChainId, setSearchParamsChainId] = useQueryState("chainId")

  const [selectedChain, setSelectedChain] = useState<WagmiChain>(arbitrum)
  const [selectedChainId, setSelectedChainId] = useState<ChainId>(arbitrum.id)

  const switchNetworkNotConnected = (newChainId: ChainId) => {
    config.setState((oldState: any) => {
      const { publicClient } = oldState

      const newChain: Chain | undefined = chains?.find(
        (chain: any) => chain.id === newChainId
      )

      if (!newChain) return oldState

      setSelectedChain(newChain)
      setSelectedChainId(newChain.id)
      setSearchParamsChainId(newChain.id.toString())

      return {
        ...oldState,
        publicClient: {
          ...publicClient,
          chain: newChain
        }
      }
    })
  }

  const { switchChain } = useSwitchChain({
    mutation: {
      onSuccess(data) {
        setSearchParamsChainId(data?.id.toString())
      }
    }
  })

  useEffect(() => {
    const parsedSearchParamsChainId = searchParamsChainId
      ? parseInt(searchParamsChainId)
      : INVALID_CHAIN_ID

    const newChainIsDiferentFromCurrent =
      parsedSearchParamsChainId !== chain?.id

    const isValidSearchParamsChainId = checkIsValidChainId(
      parsedSearchParamsChainId
    )

    if (isValidSearchParamsChainId) {
      if (isConnected && switchChain && newChainIsDiferentFromCurrent) {
        switchChain({ chainId: parsedSearchParamsChainId })
        return
      }

      if (chains) {
        const chainFromSearchParams = chains.find(
          (chain) => chain.id === parsedSearchParamsChainId
        )

        if (chainFromSearchParams) {
          setSelectedChain(chainFromSearchParams)
          setSelectedChainId(chainFromSearchParams.id)
          return
        }
      }
    }

    const chainIsNotSet = !chain?.id

    if (!isValidSearchParamsChainId && chainIsNotSet) {
      // set default chain
      setSelectedChain(arbitrum)
      setSelectedChainId(arbitrum.id)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chains, searchParamsChainId, switchChain])

  useEffect(() => {
    if (isConnected && chain) {
      setSelectedChain(chain)
      setSelectedChainId(chain?.id)
    }
  }, [chain, isConnected])
  const changeNetwork = (networkId: ChainId) => {
    isConnected
      ? switchChain && switchChain({ chainId: networkId })
      : switchNetworkNotConnected(networkId)
  }

  const networkContext = {
    chains,
    chainId: selectedChainId,
    changeNetwork,
    selectedChain,
    setChainId: setSelectedChainId
  }

  return (
    <NetworkContext.Provider value={networkContext}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetworkContext = () => useContext(NetworkContext)
