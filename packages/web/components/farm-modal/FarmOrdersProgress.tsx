import { FarmOrdersTable } from "@/components/farm-modal/FarmOrdersTable"
import { OrdersProgressBar } from "@/components/OrdersProgressBar"
import { TokenIcon } from "@/components/TokenIcon"
import {
  estimatedTotalFarm,
  farmIsComplete,
  FarmOrderProps,
  totalFarmOrdersDone,
  totalFundsUsed
} from "@/models/farm-order"
import {
  allOrderSlotsDone,
  totalFundsAmountWithTokenText,
  totalOrderSlotsDone
} from "@/models/order"
import { BodyText, TitleText } from "@/ui"
import { formatTokenValue } from "@/utils/token"

export const FarmOrdersProgress = ({ farmOrder }: FarmOrderProps) => (
  <>
    <div>
      <TitleText size={2} weight="bold" className="mb-2">
        Orders
      </TitleText>
      <div className="space-y-2">
        <div className="flex flex-col justify-between space-y-1 md:space-y-0 md:items-center md:flex-row">
          <OrdersExecuted farmOrder={farmOrder} />
          <div className="flex items-center space-x-1">
            <BodyText size="responsive" className="text-em-low">
              Total funds used:{" "}
              <span className="text-em-high">
                {formatTokenValue(totalFundsUsed(farmOrder), 2)}{" "}
                <span className="text-xs">of</span>{" "}
                {totalFundsAmountWithTokenText(farmOrder)}
              </span>
            </BodyText>
            <TokenIcon size="xs" token={farmOrder.sellToken} />
          </div>
        </div>
        <OrdersProgressBar farmOrder={farmOrder} />
        <TotalFarmEstimationText farmOrder={farmOrder} />
      </div>
    </div>
    {totalFarmOrdersDone(farmOrder) > 0 && (
      <FarmOrdersTable farmOrder={farmOrder} />
    )}
  </>
)

const TotalFarmEstimationText = ({ farmOrder }: FarmOrderProps) => {
  if (allOrderSlotsDone(farmOrder)) return
  if (totalFarmOrdersDone(farmOrder) < 1) return

  return (
    <div className="flex flex-row-reverse">
      <div
        className="flex items-center space-x-1"
        title="An estimation of the total tokens you'll buy based on the average price (calc: amount / avg)."
      >
        <BodyText size={1} className="space-x-1">
          <span className="text-em-low">Estimated total:</span>
          <span className="text-em-med">
            {formatTokenValue(estimatedTotalFarm(farmOrder))}
          </span>
          <span>{farmOrder.buyToken.symbol}</span>
        </BodyText>
        <TokenIcon size="2xs" token={farmOrder.buyToken} />
      </div>
    </div>
  )
}

const OrdersExecuted = ({ farmOrder }: FarmOrderProps) => {
  if (!totalOrderSlotsDone(farmOrder))
    return <BodyText className="text-em-low">No orders executed yet.</BodyText>

  return (
    <div className="flex items-center space-x-1">
      <BodyText size="responsive" className="text-em-low">
        Executed:
      </BodyText>
      <BodyText size="responsive">
        {totalFarmOrdersDone(farmOrder)}{" "}
        {!farmIsComplete(farmOrder) && (
          <>
            <span className="text-xs">out of </span>
            {farmOrder.orderSlots.length}
          </>
        )}
      </BodyText>
    </div>
  )
}
