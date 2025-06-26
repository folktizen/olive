"use client"

import { FarmOrders } from "@/app/farms/farmsOrders"
import { useNetworkContext } from "@/contexts"
import { useAccount } from "wagmi"
import NoWalletState from "./no-wallet-state"

export default function Page() {
  const { chainId } = useNetworkContext()
  const { address, isDisconnected } = useAccount()

  if (isDisconnected) return <NoWalletState />

  return (
    <div className="space-y-8">
      {chainId && address ? (
        <FarmOrders chainId={chainId} address={address} />
      ) : (
        <Loading />
      )}
    </div>
  )
}

const Loading = () => (
  <div className="space-y-6">
    <div className="h-12 rounded-lg bg-surface-50 animate-pulse"></div>
    <div className="h-32 rounded-lg bg-surface-50 animate-pulse"></div>
  </div>
)
