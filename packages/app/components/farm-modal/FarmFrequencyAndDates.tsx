import {
  FarmOrderProps,
  farmIsComplete,
  farmIsFinishedWithFunds,
  totalOrderSlotsDone
} from "@/models"
import { BodyText } from "@/ui"
import { formatFrequencyHours, formatTimestampToDateWithTime } from "@/utils"
import { ReactNode } from "react"

const FarmDetail = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => (
  <div className="space-y-1">
    <BodyText size={1} className="text-em-low">
      {title}
    </BodyText>
    <BodyText size={1}>{children}</BodyText>
  </div>
)

export const FarmFrequencyAndDates = ({ farmOrder }: FarmOrderProps) => {
  const orderSlots = farmOrder.orderSlots
  const hasSlots = Boolean(orderSlots.length)
  const firstSlot = hasSlots ? orderSlots[0] : farmOrder.startTime
  const lastSlot = hasSlots
    ? orderSlots[orderSlots.length - 1]
    : farmOrder.endTime
  const nextSlot = orderSlots[totalOrderSlotsDone(farmOrder)]

  return (
    <div className="grid grid-cols-2 gap-5 px-4 md:px-6 gap-x-8 md:grid-cols-4">
      <FarmDetail title="Starts on">
        {formatTimestampToDateWithTime(firstSlot)}
      </FarmDetail>
      <FarmDetail title="Ends on">
        {formatTimestampToDateWithTime(lastSlot)}
      </FarmDetail>
      <FarmDetail title="Frequency">
        Every {formatFrequencyHours(Number(farmOrder.interval))}
      </FarmDetail>
      <FarmDetail title="Next order">
        {farmIsComplete(farmOrder)
          ? "Complete"
          : farmIsFinishedWithFunds(farmOrder)
            ? "Finished with funds"
            : farmOrder.cancelledAt
              ? "Cancelled"
              : formatTimestampToDateWithTime(hasSlots ? nextSlot : firstSlot)}
      </FarmDetail>
    </div>
  )
}
