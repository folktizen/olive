import { getCowOrders } from "@/models/cow-order"
import { StackOrder } from "@/models/stack-order/types"
import { ChainId, Order } from "@useolive/sdk"

export async function getStackOrders(
  chainId: ChainId,
  orders: Order[]
): Promise<StackOrder[]> {
  const ordersPromises = orders.map(async (order): Promise<StackOrder> => {
    const cowOrders = await getCowOrders(chainId, order.id)
    return { ...order, cowOrders }
  })

  return await Promise.all(ordersPromises)
}
