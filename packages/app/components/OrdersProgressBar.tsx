import {
  farmHasRemainingFunds,
  FarmOrderProps,
  totalFarmOrdersDone
} from "@/models/farm-order"
import React, { useRef, useEffect } from "react"

const FULL_BAR_WIDTH = 100

export const OrdersProgressBar = ({ farmOrder }: FarmOrderProps) => {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const totalOrders = farmOrder.orderSlots.length
    ? farmOrder.orderSlots.length
    : 1

  useEffect(() => {
    if (progressBarRef.current) {
      const width = farmHasRemainingFunds(farmOrder)
        ? (FULL_BAR_WIDTH * totalFarmOrdersDone(farmOrder)) / totalOrders
        : FULL_BAR_WIDTH
      progressBarRef.current.style.width = `${width}%`
    }
  }, [farmOrder, totalOrders])

  return (
    <div className="w-full h-2 rounded-lg bg-surface-75">
      <div ref={progressBarRef} className="h-2 rounded-lg bg-primary-500"></div>
    </div>
  )
}
