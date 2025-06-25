"use client"

import { cx } from "class-variance-authority"
import Link from "next/link"
import { useState } from "react"

import { orderPairSymbolsText } from "@/models/order"
import {
  BodyText,
  Button,
  Dialog,
  DialogContent,
  DialogFooterActions,
  Icon,
  Modal,
  ModalBaseProps,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@/ui"

import {
  FarmOrder,
  FarmOrderProps,
  calculateFarmAveragePrice,
  farmIsComplete,
  farmIsFinishedWithFunds,
  farmRemainingFunds,
  totalFarmed,
  totalFundsUsed
} from "@/models/farm-order"

import {
  DialogConfirmTransactionLoading,
  FromToFarmTokenPair,
  TokenLogoPair,
  TransactionLink
} from "@/components"

import { FarmFrequencyAndDates } from "@/components/farm-modal/FarmFrequencyAndDates"
import { FarmOrdersProgress } from "@/components/farm-modal/FarmOrdersProgress"

import { useEthersSigner } from "@/utils/ethers"
import { formatTokenValue } from "@/utils/token"
import { getExplorerLink } from "@/utils/transaction"
import { getDCAFarmContract } from "@useolive/sdk"

import { ModalId, useModalContext, useNetworkContext } from "@/contexts"

import { Transaction } from "@/models/farm"

interface FarmModalProps extends ModalBaseProps {
  farmOrder: FarmOrder
  fetchAllOrders: () => void
  refetchFarms: () => void
}

type Content = {
  title: string
  description: string
  button: {
    action: "primary" | "secondary"
    text: string
  }
}

export const FarmModal = ({
  farmOrder,
  isOpen,
  fetchAllOrders,
  refetchFarms,
  closeAction
}: FarmModalProps) => {
  const signer = useEthersSigner()
  const { chainId } = useNetworkContext()
  const { closeModal, isModalOpen, openModal } = useModalContext()

  const [cancellationTx, setCancellationTx] = useState<Transaction>()

  const farmRemainingFundsWithTokenText = `${farmRemainingFunds(
    farmOrder
  )} ${farmOrder.sellToken.symbol}`

  const remainingFundsText = `The ${farmRemainingFundsWithTokenText} will be sent to your wallet.`

  const getConfirmCancelContent = (): Content => {
    if (farmIsFinishedWithFunds(farmOrder))
      return {
        title: "Proceed with cancelation to withdraw funds",
        description: remainingFundsText,
        button: {
          action: "primary",
          text: `Withdraw ${farmRemainingFundsWithTokenText}`
        }
      }

    return {
      title: "Are you sure you want to cancel farming?",
      description: remainingFundsText,
      button: {
        action: "secondary",
        text: "Cancel Farm"
      }
    }
  }

  const cancelFarm = async () => {
    const signerInstance = await signer
    if (!signerInstance) return

    try {
      openModal(ModalId.CANCEL_FARM_PROCESSING)
      const tx = await getDCAFarmContract(farmOrder.id, signerInstance).cancel()
      setCancellationTx(tx)
      await tx.wait()
      closeModal(ModalId.CANCEL_FARM_PROCESSING)
      openModal(ModalId.CANCEL_FARM_SUCCESS)
    } catch (e) {
      closeModal(ModalId.CANCEL_FARM_PROCESSING)
      console.error("Cancel farm error", e)
    }
  }

  const farmNotCancelledAndNotComplete =
    !farmOrder.cancelledAt && !farmIsComplete(farmOrder)

  return (
    <>
      <Modal
        maxWidth="2xl"
        isOpen={isOpen}
        closeAction={() => {
          if (
            !isModalOpen(ModalId.CANCEL_FARM_CONFIRM) &&
            !isModalOpen(ModalId.CANCEL_FARM_PROCESSING) &&
            !isModalOpen(ModalId.CANCEL_FARM_SUCCESS)
          )
            closeAction()
        }}
      >
        <ModalHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <TokenLogoPair
                buyToken={farmOrder.buyToken}
                sellToken={farmOrder.sellToken}
              />
              {chainId && (
                <Link
                  passHref
                  target="_blank"
                  href={getExplorerLink(
                    chainId,
                    farmOrder.id,
                    "address",
                    "#tokentxns"
                  )}
                  className="flex items-center space-x-0.5 hover:border-em-low border-b-2 border-em-disabled group"
                >
                  <BodyText className="text-em-med">
                    {farmOrder.id.substring(0, 7)}
                  </BodyText>
                  <Icon
                    className="text-em-med group-hover:animate-bounce"
                    name="arrow-external"
                    size={16}
                  />
                </Link>
              )}
            </div>
            <Button
              variant="quaternary"
              iconLeft="close"
              size="icon"
              onClick={closeAction}
            />
          </div>
        </ModalHeader>
        <ModalContent className="px-0 space-y-4 md:px-0">
          <FarmFrequencyAndDates farmOrder={farmOrder} />
          <div className="w-full my-4 border-b border-surface-50"></div>
          <WarningHasRemainingFunds
            farmOrder={farmOrder}
            farmRemainingFundsWithTokenText={farmRemainingFundsWithTokenText}
          />
          <div className="px-4 space-y-4 md:px-6">
            <FarmDigest farmOrder={farmOrder} />
            <FarmOrdersProgress farmOrder={farmOrder} />
          </div>
        </ModalContent>
        <ModalFooter
          className={cx({
            "pt-0 pb-6": !farmNotCancelledAndNotComplete
          })}
        >
          {farmNotCancelledAndNotComplete && (
            <Button
              variant={getConfirmCancelContent().button.action}
              onClick={() => openModal(ModalId.CANCEL_FARM_CONFIRM)}
              width="full"
            >
              {getConfirmCancelContent().button.text}
            </Button>
          )}
        </ModalFooter>
      </Modal>
      <Dialog
        isOpen={isModalOpen(ModalId.CANCEL_FARM_CONFIRM)}
        closeAction={() => closeModal(ModalId.CANCEL_FARM_CONFIRM)}
      >
        <DialogContent
          title={getConfirmCancelContent().title}
          description={getConfirmCancelContent().description}
        />
        <DialogFooterActions
          primaryAction={() => cancelFarm()}
          primaryText="Proceed"
          secondaryAction={() => closeModal(ModalId.CANCEL_FARM_CONFIRM)}
          secondaryText="Cancel"
        />
      </Dialog>
      <DialogConfirmTransactionLoading
        closeAction={() => closeModal(ModalId.CANCEL_FARM_PROCESSING)}
        isOpen={isModalOpen(ModalId.CANCEL_FARM_PROCESSING)}
        title={cancellationTx && "Proceeding cancellation"}
        description={cancellationTx && "Waiting for transaction confirmation."}
      >
        {cancellationTx?.hash && chainId && (
          <TransactionLink chainId={chainId} hash={cancellationTx.hash} />
        )}
      </DialogConfirmTransactionLoading>
      <Dialog
        isOpen={isModalOpen(ModalId.CANCEL_FARM_SUCCESS)}
        closeAction={() => closeModal(ModalId.CANCEL_FARM_SUCCESS)}
      >
        <Icon name="check" className="text-primary-400" size={38} />
        <DialogContent
          title="Farm Cancelled"
          description={`The ${farmRemainingFundsWithTokenText} were sent to your wallet.`}
        />
        {cancellationTx?.hash && chainId && (
          <TransactionLink chainId={chainId} hash={cancellationTx.hash} />
        )}
        <DialogFooterActions
          primaryAction={() => {
            refetchFarms()
            fetchAllOrders()
            closeModal(ModalId.CANCEL_FARM_PROCESSING)
            closeModal(ModalId.CANCEL_FARM_SUCCESS)
            closeAction()
          }}
          primaryText="Back to Farms"
        />
      </Dialog>
    </>
  )
}

const FarmDigest = ({ farmOrder }: FarmOrderProps) => (
  <div className="flex flex-col justify-between gap-2 px-4 py-3 md:px-6 md:items-center md:flex-row bg-surface-25 rounded-2xl">
    <FromToFarmTokenPair
      fromToken={farmOrder.sellToken}
      fromText={formatTokenValue(totalFundsUsed(farmOrder))}
      toToken={farmOrder.buyToken}
      toText={formatTokenValue(totalFarmed(farmOrder))}
    />
    <BodyText size="responsive" className="space-x-1">
      <span className="text-em-low">Avg buy price:</span>
      <span className="text-em-med">
        {formatTokenValue(calculateFarmAveragePrice(farmOrder))}
      </span>
      <span className="text-em-med">{orderPairSymbolsText(farmOrder)}</span>
    </BodyText>
  </div>
)

interface WarningHasRemainingFundsProps extends FarmOrderProps {
  farmRemainingFundsWithTokenText: string
}

const WarningHasRemainingFunds = ({
  farmOrder,
  farmRemainingFundsWithTokenText
}: WarningHasRemainingFundsProps) => {
  if (!farmIsFinishedWithFunds(farmOrder)) return

  return (
    <div className="px-4 md:px-6">
      <div className="p-3 text-center rounded-lg bg-danger-75">
        <BodyText className="text-em-med">
          This contract has {farmRemainingFundsWithTokenText} remaining funds.
        </BodyText>
      </div>
    </div>
  )
}
