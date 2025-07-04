import { Order as CowOrder } from "@cowprotocol/cow-sdk"
import { Order } from "@useolive/sdk"

export interface FarmOrder extends Order {
  cowOrders: CowOrder[]
}

export interface FarmOrderProps {
  farmOrder: FarmOrder
}
