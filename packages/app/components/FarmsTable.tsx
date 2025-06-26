"use client"

import { FarmModal, TokenLogoPair } from "@/components"
import { ModalId, useModalContext } from "@/contexts"
import {
  FarmOrder,
  FarmOrderProps,
  calculateFarmAveragePrice,
  farmIsFinishedWithFunds,
  totalFarmOrdersDone,
  totalFarmed,
  totalFundsUsed
} from "@/models/farm-order"
import {
  orderPairSymbolsText,
  totalFundsAmountWithTokenText,
  totalOrderSlotsDone
} from "@/models/order"
import {
  BodyText,
  Button,
  CaptionText,
  Icon,
  OverlineText,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui"
import { formatTimestampToDate } from "@/utils/datetime"
import { formatTokenValue } from "@/utils/token"
import { formatDistanceToNow } from "date-fns"
import { PropsWithChildren, useState } from "react"

interface FarmsTableProps {
  farmOrders: FarmOrder[]
  fetchAllOrders: () => void
  refetchFarms: () => void
  hasMorePages: boolean
  hasLessPages: boolean
  nextPage: () => void
  previousPage: () => void
}

export const FarmsTable = ({
  farmOrders,
  fetchAllOrders,
  refetchFarms,
  hasMorePages,
  hasLessPages,
  nextPage,
  previousPage
}: FarmsTableProps) => {
  const [farmOrder, setFarmOrder] = useState<FarmOrder>()

  const { closeModal, isModalOpen, openModal } = useModalContext()

  const setupAndOpenModal = (farmOrder: FarmOrder) => {
    setFarmOrder(farmOrder)
    openModal(ModalId.FARM)
  }

  return (
    <div className="w-full bg-white border shadow-xs rounded-3xl border-surface-50">
      <Table>
        <TableHeader>
          <TableRow className="h-10 md:h-12">
            <TableHead>Farm</TableHead>
            <TableHead className="text-right">Used funds</TableHead>
            <TableHead className="text-right">Avg. Buy Price</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {farmOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="flex items-center font-medium w-max">
                <TokenLogoPair
                  buyToken={order.buyToken}
                  sellToken={order.sellToken}
                />
                <div className="ml-3 space-y-0.5">
                  <BodyText weight="bold">
                    {formatTokenValue(totalFarmed(order))}
                  </BodyText>
                  <CaptionText className="text-em-low">
                    {orderPairSymbolsText(order)}
                  </CaptionText>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <CellWrapper>
                  <BodyText className="text-em-high">
                    {formatTokenValue(totalFundsUsed(order), 2)}
                  </BodyText>
                  <BodyText className="text-em-low">
                    / {totalFundsAmountWithTokenText(order)}
                  </BodyText>
                </CellWrapper>
              </TableCell>
              <TableCell className="text-right">
                <CellWrapper>
                  <BodyText className="text-em-high">
                    {formatTokenValue(calculateFarmAveragePrice(order))}
                  </BodyText>
                  <BodyText className="text-em-low">
                    {orderPairSymbolsText(order)}
                  </BodyText>
                </CellWrapper>
              </TableCell>
              <TableCell className="text-right">
                <CellWrapper>
                  {farmIsFinishedWithFunds(order) ? (
                    <div className="flex items-center p-1 space-x-1.5 rounded">
                      <Icon
                        name="warning"
                        size={14}
                        className="text-danger-500"
                      />
                      <OverlineText className="text-danger-500">
                        Widthdraw funds
                      </OverlineText>
                    </div>
                  ) : (
                    <OrdersProgressText farmOrder={order} />
                  )}
                </CellWrapper>
              </TableCell>
              <TableCell>
                <Button
                  className="w-max"
                  width="fit"
                  variant="tertiary"
                  onClick={() => setupAndOpenModal(order)}
                >
                  View details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {(hasMorePages || hasLessPages) && (
            <div className={`flex items-center w-full mx-auto space-x-4 p-4`}>
              <Button
                variant="tertiary"
                iconLeft="caret-left"
                size="icon"
                onClick={previousPage}
                disabled={!hasLessPages}
              />
              <Button
                variant="tertiary"
                iconLeft="caret-right"
                size="icon"
                onClick={nextPage}
                disabled={!hasMorePages}
              />
            </div>
          )}
        </TableFooter>
      </Table>
      {farmOrder && (
        <FarmModal
          refetchFarms={refetchFarms}
          fetchAllOrders={fetchAllOrders}
          isOpen={isModalOpen(ModalId.FARM)}
          closeAction={() => closeModal(ModalId.FARM)}
          farmOrder={farmOrder}
        />
      )}
    </div>
  )
}

const CellWrapper = ({ children }: PropsWithChildren) => (
  <div className="flex items-center justify-end space-x-1 w-max lg:w-auto">
    {children}
  </div>
)

const OrdersProgressText = ({ farmOrder }: FarmOrderProps) => {
  if (farmOrder.cancelledAt) {
    return (
      <BodyText className="text-em-low">
        Cancelled at {formatTimestampToDate(farmOrder.cancelledAt)}
      </BodyText>
    )
  }

  if (totalOrderSlotsDone(farmOrder) !== 0) {
    return (
      <>
        <BodyText className="text-em-high">
          {totalFarmOrdersDone(farmOrder).toString()}
        </BodyText>
        <BodyText className="text-em-low">{`/ ${
          farmOrder.orderSlots.length || farmOrder.cowOrders.length
        } orders`}</BodyText>
      </>
    )
  }

  const firtTimeSlot = Number(farmOrder.orderSlots[0] ?? farmOrder.startTime)
  const date = new Date(firtTimeSlot * 1000) // Convert seconds to milliseconds
  const distanceToNow = formatDistanceToNow(date, { addSuffix: true })

  return (
    <BodyText className="text-primary-700">
      {`Starts ${distanceToNow}`}
    </BodyText>
  )
}
