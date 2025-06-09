import { Address, BigInt } from "@graphprotocol/graph-ts"
import { TradeFoundry } from "../../generated/TradeFoundry/TradeFoundry"
import { DCAFarm, Token } from "../../generated/schema"
import {
  Cancelled,
  DCAFarm as DCAFarmContract,
  Initialized
} from "../../generated/templates/DCAFarm/DCAFarm"
import { ERC20 as ERC20Contract } from "../../generated/templates/DCAFarm/ERC20"

const HUNDRED_PERCENT = BigInt.fromI32(10000)

export function createOrReturnTokenEntity(contractAddress: Address): Token {
  let tokenId = contractAddress.toHex()
  let token = Token.load(tokenId)

  // Return existing token if it's already in the store
  if (token !== null) {
    return token
  }

  // Create a new token entity
  token = new Token(tokenId)
  let tokenContract = ERC20Contract.bind(contractAddress)

  // Set the address field
  token.address = contractAddress

  // Name
  let tryName = tokenContract.try_name()
  token.name = tryName.reverted ? "Unknown Token" : tryName.value

  // Symbol
  let trySymbol = tokenContract.try_symbol()
  token.symbol = trySymbol.reverted ? "UNKNOWN" : trySymbol.value

  // Decimals
  let tryDecimals = tokenContract.try_decimals()
  token.decimals = tryDecimals.reverted ? 18 : tryDecimals.value

  token.save()
  return token
}

export function handleDCAFarmInitialized(event: Initialized): void {
  const orderAddress = event.params.order
  const orderContract = DCAFarmContract.bind(orderAddress)
  const order = new DCAFarm(orderAddress.toHex())

  order.createdAt = event.block.timestamp

  let tryOwner = orderContract.try_owner()
  order.owner = tryOwner.reverted
    ? Address.fromString("0x0000000000000000000000000000000000000000")
    : tryOwner.value

  let trySellToken = orderContract.try_sellToken()
  order.sellToken = trySellToken.reverted
    ? ""
    : createOrReturnTokenEntity(trySellToken.value).id

  let tryBuyToken = orderContract.try_buyToken()
  order.buyToken = tryBuyToken.reverted
    ? ""
    : createOrReturnTokenEntity(tryBuyToken.value).id

  let tryReceiver = orderContract.try_receiver()
  order.receiver = tryReceiver.reverted
    ? Address.fromString("0x0000000000000000000000000000000000000000")
    : tryReceiver.value

  let orderSlots: Array<BigInt> = [BigInt.fromI32(0)]
  let protocolFee: BigInt = BigInt.fromI32(0)

  let tradeFoundryAddress: Address
  if (event.transaction.to !== null) {
    tradeFoundryAddress = event.transaction.to as Address
  } else {
    tradeFoundryAddress = Address.fromString(
      "0x0000000000000000000000000000000000000000"
    )
  }

  const foundry = TradeFoundry.bind(tradeFoundryAddress)
  let tryProtocolFee = foundry.try_protocolFee()
  if (!tryProtocolFee.reverted) {
    protocolFee = BigInt.fromI32(tryProtocolFee.value)
  }

  let tryOrderSlots = orderContract.try_orderSlots()
  if (!tryOrderSlots.reverted) {
    orderSlots = tryOrderSlots.value
  }

  let tryAmount = orderContract.try_amount()
  order.amount = tryAmount.reverted ? BigInt.fromI32(0) : tryAmount.value

  order.fee = protocolFee
  order.feeAmount = order.amount
    .times(protocolFee)
    .div(HUNDRED_PERCENT.minus(protocolFee))

  let tryEndTime = orderContract.try_endTime()
  order.endTime = tryEndTime.reverted ? 0 : tryEndTime.value.toI32()

  let tryStartTime = orderContract.try_startTime()
  order.startTime = tryStartTime.reverted ? 0 : tryStartTime.value.toI32()

  order.orderSlots = orderSlots

  let tryInterval = orderContract.try_interval()
  order.interval = tryInterval.reverted ? BigInt.fromI32(0) : tryInterval.value

  order.save()
}

export function handleDCAFarmCancelled(event: Cancelled): void {
  const order = DCAFarm.load(event.params.order.toHex())
  if (order === null) {
    return
  }
  order.cancelledAt = event.block.timestamp
  order.save()
}
