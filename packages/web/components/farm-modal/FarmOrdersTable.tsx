import { useState } from "react"

import { useNetworkContext } from "@/contexts"
import {
  cowExplorerUrl,
  FarmOrder,
  FarmOrderProps,
  orderPairSymbolsText
} from "@/models"
import {
  BodyText,
  Icon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui"
import { addressShortner, convertedAmount, formatDate } from "@/utils"
import { Order as CowOrder, OrderStatus } from "@cowprotocol/cow-sdk"
import Link from "next/link"

const INITIAL_NUMBER_OF_COW_ORDERS = 8
const MORE_ORDERS_NUMBER = 4

export const FarmOrdersTable = ({ farmOrder }: FarmOrderProps) => {
  const initialCowOrders =
    farmOrder?.cowOrders?.slice(0, INITIAL_NUMBER_OF_COW_ORDERS) ?? []

  const [cowOrders, setCowOrders] = useState<CowOrder[]>(initialCowOrders)

  const addMoreOrders = () =>
    setCowOrders(
      farmOrder.cowOrders.slice(0, cowOrders.length + MORE_ORDERS_NUMBER)
    )

  const hasMoreOrders = farmOrder?.cowOrders?.length > cowOrders.length

  return (
    <div className="border border-surface-75 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-1 md:table-cell">
              <BodyText size={1}>
                <span className="hidden md:inline-block">Transaction</span>
                <span className="md:hidden">Tx</span>
              </BodyText>
            </TableHead>
            <TableHead>
              <BodyText size={1}>Time</BodyText>
            </TableHead>
            <TableHead className="py-1 text-right">
              <BodyText size={1}> {farmOrder.sellToken.symbol} spent</BodyText>
            </TableHead>
            <TableHead className="py-1 text-right">
              <BodyText size={1}>{farmOrder.buyToken.symbol} bought</BodyText>
            </TableHead>
            <TableHead className="hidden py-1 text-right md:table-cell">
              <BodyText size={1}>{orderPairSymbolsText(farmOrder)}</BodyText>
            </TableHead>
          </TableRow>
        </TableHeader>
        {cowOrders.length > 0 ? (
          <>
            <TableCowBody farmOrder={farmOrder} cowOrders={cowOrders} />
            {hasMoreOrders && (
              <TableCaption className="pb-2 mt-2">
                <div
                  className="text-sm cursor-pointer text-primary-700 hover:underline hover:underline-offset-2"
                  onClick={addMoreOrders}
                >
                  Show more orders
                </div>
              </TableCaption>
            )}
          </>
        ) : (
          <FailedToFetchCowData />
        )}
      </Table>
    </div>
  )
}

const getOrderStatusText = (orderStatus: OrderStatus, price?: number) => {
  switch (orderStatus) {
    case OrderStatus.FULFILLED:
      return price?.toFixed(4)
    case OrderStatus.CANCELLED:
    case OrderStatus.EXPIRED:
    case OrderStatus.PRESIGNATURE_PENDING:
      return orderStatus
    case OrderStatus.OPEN:
      return "in progress"
  }
}

const formatDisplayAmount = (amount: number) => {
  if (amount > 0 && amount < 0.0001) {
    return "<0.0001"
  }
  return amount.toFixed(4)
}

const TableCowBody = ({
  farmOrder,
  cowOrders
}: {
  farmOrder: FarmOrder
  cowOrders: CowOrder[]
}) => {
  const { chainId } = useNetworkContext()

  return (
    <TableBody>
      {cowOrders.map((cowOrder) => {
        const executedBuyAmount = convertedAmount(
          cowOrder.executedBuyAmount,
          farmOrder.buyToken.decimals
        )
        const executedSellAmount = convertedAmount(
          cowOrder.executedSellAmount,
          farmOrder.sellToken.decimals
        )
        const averagePrice = executedSellAmount / executedBuyAmount

        return (
          <TableRow key={cowOrder.uid}>
            <TableCell className="py-2 md:table-cell">
              <BodyText
                size={1}
                className="text-primary-700 hover:underline hover:underline-offset-2"
              >
                <Link
                  target="_blank"
                  href={cowExplorerUrl(chainId, cowOrder.uid)}
                >
                  <span className="md:hidden">
                    {addressShortner(cowOrder.uid, 2)}
                  </span>
                  <span className="hidden md:inline-block">
                    {addressShortner(cowOrder.uid)}
                  </span>
                </Link>
              </BodyText>
            </TableCell>
            <TableCell className="py-2">
              <BodyText className="text-em-med" size={1}>
                {formatDate(cowOrder.creationDate)}
              </BodyText>
            </TableCell>
            <TableCell className="py-2 text-right ">
              <BodyText className="text-em-med" size={1}>
                {formatDisplayAmount(executedSellAmount)}
              </BodyText>
            </TableCell>
            <TableCell className="py-2 text-right ">
              <BodyText className="text-em-med" size={1}>
                {formatDisplayAmount(executedBuyAmount)}
              </BodyText>
            </TableCell>
            <TableCell className="hidden py-2 text-right md:table-cell">
              <BodyText className="capitalize text-em-med" size={1}>
                {getOrderStatusText(cowOrder.status, averagePrice)}
              </BodyText>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

const FailedToFetchCowData = () => (
  <TableCaption className="pb-2 mt-2 space-y-1">
    <Icon name="warning" className="text-danger-500" />
    <BodyText weight="medium" size={1} className="text-danger-500">
      Failed to fetch data.
    </BodyText>
  </TableCaption>
)
