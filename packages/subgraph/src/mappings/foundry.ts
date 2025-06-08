import { OrderCreated } from "../../generated/TradeFoundry/TradeFoundry"
import { TradeFoundry } from "../../generated/schema"
import { DCAFarm as DCAFarmTemplate } from "../../generated/templates"

// This handler is called by block handlers
export function handleDCAFarmCreated(event: OrderCreated): void {
  let tradeFoundry = TradeFoundry.load("1")

  if (tradeFoundry === null) {
    tradeFoundry = new TradeFoundry("1")
    tradeFoundry.address = event.address
    tradeFoundry.orderCount = 0
  }

  tradeFoundry.orderCount = tradeFoundry.orderCount + 1
  tradeFoundry.save()

  // Create a new Vault entity
  DCAFarmTemplate.create(event.params.order)
}
