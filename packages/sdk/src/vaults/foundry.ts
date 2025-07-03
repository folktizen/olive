import type { Provider } from "@ethersproject/abstract-provider"
import type { Signer } from "@ethersproject/abstract-signer"
import { AddressZero } from "@ethersproject/constants"
import type { ContractReceipt } from "@ethersproject/contracts"

import { ChainId, MULTICALL_ADDRESS } from "../constants"
import {
  DCAFarm__factory,
  ERC20__factory,
  ERC20Bytes32__factory,
  Multicall__factory,
  TradeFoundry,
  TradeFoundry__factory
} from "../generated/contracts"
import {
  getCOWProtocolSettlementAddress,
  getDCAFarmSingletonAddress
} from "./constants"

/**
 * Creates a contract instance for a DCA farm
 * @param proxyAddress
 * @param provider
 * @returns
 */
export function getDCAFarmContract(
  proxyAddress: string,
  signerOrProvider: Provider | Signer
) {
  return DCAFarm__factory.connect(proxyAddress, signerOrProvider)
}

/**
 * Create a contract instance for an ERC20 token
 * @param tokenAddress
 * @param provider
 * @returns
 */
export function getERC20Contract(
  tokenAddress: string,
  signerOrProvider: Provider | Signer
) {
  return ERC20__factory.connect(tokenAddress, signerOrProvider)
}

/**
 * Create a contract instance for an ERC20 bytes 32 token
 * @param tokenAddress
 * @param provider
 * @returns
 */
export function getERC20Byte32Contract(
  tokenAddress: string,
  signerOrProvider: Provider | Signer
) {
  return ERC20Bytes32__factory.connect(tokenAddress, signerOrProvider)
}

/**
 *
 * @param address
 * @param provider
 * @returns
 */
export function getTradeFoundry(
  address: string,
  signerOrProvider: Provider | Signer
) {
  if (address === AddressZero) {
    throw new Error(`Zero address is not a valid order foundry address`)
  }

  return TradeFoundry__factory.connect(address, signerOrProvider)
}

export function getTradeFoundryInterface() {
  return TradeFoundry__factory.createInterface()
}

export function getDCAFarmInterface() {
  return DCAFarm__factory.createInterface()
}

export function getERC20Interface() {
  return ERC20__factory.createInterface()
}

export function getOrderAddressFromTransactionReceipt(
  receipt: ContractReceipt
) {
  const tradeFoundryInterface = getTradeFoundryInterface()
  let prxoyAddress: undefined | string

  receipt.events?.forEach((event) => {
    if (
      event.event === tradeFoundryInterface.events["OrderCreated(address)"].name
    ) {
      prxoyAddress = event.args?.[0]
    }
  })

  return prxoyAddress
}

interface CreateorderWithNonceInitializeParams {
  receiver: string
  sellToken: string
  buyToken: string
  amount: string
  startTime: number
  endTime: number
  interval: number
  owner: string
  nonce: number
}

/**
 * Creates a DCA farm with a given nonce
 * @param tradeFoundry The order foundry contract
 * @param param0
 * @returns
 */
export async function createDCAFarmWithNonce(
  tradeFoundry: TradeFoundry,
  {
    owner,
    receiver,
    sellToken,
    buyToken,
    amount,
    startTime,
    endTime,
    interval,
    nonce
  }: CreateorderWithNonceInitializeParams
) {
  const rawChainId = (await tradeFoundry.provider
    .getNetwork()
    .then((n) => n.chainId)) as number
  const chainId = rawChainId as ChainId

  const chainNotSupported =
    chainId !== ChainId.ETHEREUM &&
    chainId !== ChainId.ARBITRUM &&
    chainId !== ChainId.BASE &&
    chainId !== ChainId.GNOSIS
  // chainId !== ChainId.POLYGON &&
  // chainId !== ChainId.AVALANCHE

  if (chainNotSupported) {
    throw new Error(`Chain id ${chainId} is not supported`)
  }

  const singleton = getDCAFarmSingletonAddress(chainId)
  const settlementContract = getCOWProtocolSettlementAddress(chainId)

  return await tradeFoundry.createOrderWithNonce(
    singleton,
    owner,
    receiver,
    sellToken,
    buyToken,
    amount,
    startTime,
    endTime,
    interval,
    settlementContract,
    nonce
  )
}

/**
 * Returns a contract instance for the Multicall contract
 * @param signerOrProvider
 * @returns
 */
export function getMulticallContract(signerOrProvider: Provider | Signer) {
  return Multicall__factory.connect(MULTICALL_ADDRESS, signerOrProvider)
}
