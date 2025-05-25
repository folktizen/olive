"use client";

import { PropsWithChildren, useState } from "react";
import { formatDistanceToNow } from "date-fns";
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
  TableRow,
} from "@/ui";
import { StackModal, TokenLogoPair } from "@/components";
import {
  totalFundsAmountWithTokenText,
  orderPairSymbolsText,
  totalOrderSlotsDone,
} from "@/models/order";
import { formatTimestampToDate } from "@/utils/datetime";
import {
  StackOrder,
  StackOrderProps,
  calculateStackAveragePrice,
  stackIsFinishedWithFunds,
  totalFundsUsed,
  totalStackOrdersDone,
  totalStacked,
} from "@/models/stack-order";
import { formatTokenValue } from "@/utils/token";
import { ModalId, useModalContext } from "@/contexts";

interface StacksTableProps {
  stackOrders: StackOrder[];
  fetchAllOrders: () => void;
  refetchStacks: () => void;
  hasMorePages: boolean;
  hasLessPages: boolean;
  nextPage: () => void;
  previousPage: () => void;
}

export const StacksTable = ({
  stackOrders,
  fetchAllOrders,
  refetchStacks,
  hasMorePages,
  hasLessPages,
  nextPage,
  previousPage,
}: StacksTableProps) => {
  const [stackOrder, setStackOrder] = useState<StackOrder>();

  const { closeModal, isModalOpen, openModal } = useModalContext();

  const setupAndOpenModal = (stackOrder: StackOrder) => {
    setStackOrder(stackOrder);
    openModal(ModalId.STACK);
  };

  return (
    <div className="w-full bg-white border shadow-xs rounded-3xl border-surface-50">
      <Table>
        <TableHeader>
          <TableRow className="h-10 md:h-12">
            <TableHead>Stack</TableHead>
            <TableHead className="text-right">Used funds</TableHead>
            <TableHead className="text-right">Avg. Buy Price</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stackOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="flex items-center font-medium w-max">
                <TokenLogoPair buyToken={order.buyToken} sellToken={order.sellToken} />
                <div className="ml-3 space-y-0.5">
                  <BodyText weight="bold">{formatTokenValue(totalStacked(order))}</BodyText>
                  <CaptionText className="text-em-low">{orderPairSymbolsText(order)}</CaptionText>
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
                    {formatTokenValue(calculateStackAveragePrice(order))}
                  </BodyText>
                  <BodyText className="text-em-low">{orderPairSymbolsText(order)}</BodyText>
                </CellWrapper>
              </TableCell>
              <TableCell className="text-right">
                <CellWrapper>
                  {stackIsFinishedWithFunds(order) ? (
                    <div className="flex items-center p-1 space-x-1.5 rounded">
                      <Icon name="warning" size={14} className="text-danger-500" />
                      <OverlineText className="text-danger-500">Widthdraw funds</OverlineText>
                    </div>
                  ) : (
                    <OrdersProgressText stackOrder={order} />
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
      {stackOrder && (
        <StackModal
          refetchStacks={refetchStacks}
          fetchAllOrders={fetchAllOrders}
          isOpen={isModalOpen(ModalId.STACK)}
          closeAction={() => closeModal(ModalId.STACK)}
          stackOrder={stackOrder}
        />
      )}
    </div>
  );
};

const CellWrapper = ({ children }: PropsWithChildren) => (
  <div className="flex items-center justify-end space-x-1 w-max lg:w-auto">{children}</div>
);

const OrdersProgressText = ({ stackOrder }: StackOrderProps) => {
  if (stackOrder.cancelledAt) {
    return (
      <BodyText className="text-em-low">
        Cancelled at {formatTimestampToDate(stackOrder.cancelledAt)}
      </BodyText>
    );
  }

  if (totalOrderSlotsDone(stackOrder) !== 0) {
    return (
      <>
        <BodyText className="text-em-high">{totalStackOrdersDone(stackOrder).toString()}</BodyText>
        <BodyText className="text-em-low">{`/ ${
          stackOrder.orderSlots.length || stackOrder.cowOrders.length
        } orders`}</BodyText>
      </>
    );
  }

  const firtTimeSlot = Number(stackOrder.orderSlots[0] ?? stackOrder.startTime);
  const date = new Date(firtTimeSlot * 1000); // Convert seconds to milliseconds
  const distanceToNow = formatDistanceToNow(date, { addSuffix: true });

  return <BodyText className="text-primary-700">{`Starts ${distanceToNow}`}</BodyText>;
};
