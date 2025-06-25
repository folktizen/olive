import { allOrderSlotsDone, oliveFee } from "@/models/order"
import { FarmOrder } from "@/models/farm-order"
import { convertedAmount } from "@/utils/numbers"
import { OrderStatus } from "@cowprotocol/cow-sdk"

export const totalFarmOrdersDone = (order: FarmOrder) => {
  if (!order?.cowOrders?.length) return 0

  return order.cowOrders.length
}

export const estimatedTotalFarm = (order: FarmOrder) => {
  let estimation = 0
  const avgFarmPrice = calculateFarmAveragePrice(order)

  if (order.cowOrders && order.cowOrders.length > 0) {
    estimation =
      convertedAmount(order.amount, order.sellToken.decimals) / avgFarmPrice
  }

  return estimation
}

export const calculateFarmAveragePrice = (order: FarmOrder) => {
  let totalExecutedBuyAmount = 0
  let totalExecutedSellAmount = 0

  if (!order?.cowOrders?.length) return 0

  order.cowOrders.forEach((cowOrder) => {
    if (cowOrder.executedBuyAmount === "0") return
    if (cowOrder.status !== OrderStatus.FULFILLED) return

    totalExecutedBuyAmount += convertedAmount(
      cowOrder.executedBuyAmount,
      order.buyToken.decimals
    )
    totalExecutedSellAmount += convertedAmount(
      cowOrder.executedSellAmount,
      order.sellToken.decimals
    )
  })
  const averagePrice = totalExecutedSellAmount / totalExecutedBuyAmount
  return totalExecutedBuyAmount ? averagePrice : 0
}

export const totalFundsUsed = (order: FarmOrder) => {
  const total =
    order.cowOrders?.reduce((acc, cowOrder) => {
      return (
        acc +
        convertedAmount(cowOrder.executedSellAmount, order.sellToken.decimals)
      )
    }, 0) ?? 0

  return total + oliveFee(order)
}

export const totalFarmed = (order: FarmOrder) =>
  order.cowOrders?.reduce((acc, cowOrder) => {
    return (
      acc + convertedAmount(cowOrder.executedBuyAmount, order.buyToken.decimals)
    )
  }, 0) ?? 0

export const farmHasRemainingFunds = (farmOrder: FarmOrder) =>
  totalFundsUsed(farmOrder) >= oliveFee(farmOrder) &&
  farmRemainingFunds(farmOrder) > oliveFee(farmOrder)

export const farmRemainingFunds = (farmOrder: FarmOrder) => {
  if (
    farmOrder.cowOrders?.length &&
    totalFundsUsed(farmOrder) === 0 &&
    totalFarmOrdersDone(farmOrder) > 0
  )
    return 0
  return (
    convertedAmount(farmOrder.amount, farmOrder.sellToken.decimals) -
    totalFundsUsed(farmOrder)
  )
}

export const farmIsComplete = (farmOrder: FarmOrder) =>
  allOrderSlotsDone(farmOrder) && !farmHasRemainingFunds(farmOrder)

export const farmIsFinishedWithFunds = (farmOrder: FarmOrder) =>
  allOrderSlotsDone(farmOrder) &&
  farmHasRemainingFunds(farmOrder) &&
  !farmOrder.cancelledAt
