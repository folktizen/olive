import { getCowOrders } from "@/models/cow-order"
import { FarmOrder } from "@/models/farm-order/types"
import { ChainId, Order } from "@useolive/sdk"

export async function getFarmOrders(
  chainId: ChainId,
  orders: Order[]
): Promise<FarmOrder[]> {
  const ordersPromises = orders.map(async (order): Promise<FarmOrder> => {
    const cowOrders = await getCowOrders(chainId, order.id)
    return { ...order, cowOrders }
  })

  return await Promise.all(ordersPromises)
}
