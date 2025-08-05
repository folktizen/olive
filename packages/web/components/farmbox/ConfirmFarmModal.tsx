"use client"

import { useEffect, useRef, useState } from "react"

import { format } from "date-fns"
import { parseUnits } from "viem"
import { useAccount } from "wagmi"

import {
  DialogConfirmTransactionLoading,
  FromToFarmTokenPair,
  TransactionLink
} from "@/components"
import { ModalId, useModalContext, useNetworkContext } from "@/contexts"
import {
  FREQUENCY_OPTIONS,
  INITAL_ORDER,
  Token,
  Transaction,
  frequencySeconds
} from "@/models"
import {
  BodyText,
  Button,
  Modal,
  ModalBaseProps,
  ModalContent,
  ModalFooter,
  ModalHeaderTitle,
  TitleText
} from "@/ui"
import { dateToUnixTimestamp, useEthersSigner } from "@/utils"
import {
  ChainId,
  createDCAFarmWithNonce,
  getERC20Contract,
  getTradeFoundry,
  getTradeFoundryAddress
} from "@useolive/sdk"

interface ConfirmFarmModalProps extends ModalBaseProps {
  fromToken: Token
  toToken: Token
  amount: string
  frequency: FREQUENCY_OPTIONS
  startTime: Date
  endTime: Date
  onSuccess: () => void
}

const frequencyIntervalInHours = {
  [FREQUENCY_OPTIONS.hour]: 1,
  [FREQUENCY_OPTIONS.day]: 24,
  [FREQUENCY_OPTIONS.week]: 24 * 7,
  [FREQUENCY_OPTIONS.month]: 24 * 30
}

enum CREATE_FARM_STEPS {
  approve = "approve",
  create = "create"
}

export const ConfirmFarmModal = ({
  fromToken,
  toToken,
  amount,
  frequency,
  startTime,
  endTime,
  isOpen,
  closeAction,
  onSuccess
}: ConfirmFarmModalProps) => {
  const { address } = useAccount()
  const { chainId } = useNetworkContext()
  const signer = useEthersSigner({ chainId })
  const { closeModal, isModalOpen, openModal } = useModalContext()

  const focusBtnRef = useRef<HTMLButtonElement>(null)

  const [step, setStep] = useState(CREATE_FARM_STEPS.approve)
  const [allowance, setAllowance] = useState<string>()

  const [approveTx, setApproveTx] = useState<Transaction>()
  const [farmCreationTx, setFarmCreationTx] = useState<Transaction>()

  const rawAmount = parseUnits(amount, fromToken.decimals)
  const estimatedNumberOfOrders =
    Math.floor(
      (endTime.getTime() - startTime.getTime()) / frequencySeconds[frequency]
    ) + INITAL_ORDER

  const amountPerOrder = (parseFloat(amount) / estimatedNumberOfOrders).toFixed(
    2
  )

  useEffect(() => {
    if (allowance && BigInt(allowance) >= rawAmount)
      setStep(CREATE_FARM_STEPS.create)
  }, [allowance, rawAmount])

  useEffect(() => {
    ;(async () => {
      const signerInstance = await signer
      if (!signerInstance || !address) return

      try {
        const foundryAddress = getTradeFoundryAddress(chainId as ChainId)
        getERC20Contract(fromToken.address, signerInstance)
          .allowance(address, foundryAddress)
          .then((value) => setAllowance(value.toString()))
      } catch (e) {
        console.error(e)
      }
    })()
  }, [signer, address, fromToken.address, chainId])

  const approveFromToken = async () => {
    const signerInstance = await signer
    if (!signerInstance || !address || !chainId) return

    const sellTokenContract = getERC20Contract(
      fromToken.address,
      signerInstance
    )

    try {
      openModal(ModalId.FARM_APPROVE_PROCESSING)
      const approveFoundryTransaction = await sellTokenContract.approve(
        getTradeFoundryAddress(chainId),
        rawAmount
      )
      setApproveTx(approveFoundryTransaction)

      await approveFoundryTransaction.wait()

      setStep(CREATE_FARM_STEPS.create)
      closeModal(ModalId.FARM_APPROVE_PROCESSING)
    } catch (e) {
      closeModal(ModalId.FARM_APPROVE_PROCESSING)
      console.error(e)
    }
  }

  const createFarm = async () => {
    const signerInstance = await signer
    if (!signerInstance || !address || !chainId) return

    const initParams: Parameters<typeof createDCAFarmWithNonce>[1] = {
      nonce: dateToUnixTimestamp(new Date()),
      owner: address as string,
      receiver: address as string,
      sellToken: fromToken.address,
      buyToken: toToken.address,
      amount: rawAmount.toString(),
      startTime: dateToUnixTimestamp(startTime),
      endTime: dateToUnixTimestamp(endTime),
      interval: frequencyIntervalInHours[frequency]
    }

    const tradeFoundry = getTradeFoundry(
      getTradeFoundryAddress(chainId),
      signerInstance
    )

    try {
      openModal(ModalId.FARM_CREATION_PROCESSING)

      const createOrderTransaction = await createDCAFarmWithNonce(
        tradeFoundry,
        initParams
      )
      setFarmCreationTx(createOrderTransaction)

      await createOrderTransaction.wait()
      closeModal(ModalId.FARM_CREATION_PROCESSING)
      onSuccess()
    } catch (e) {
      closeModal(ModalId.FARM_CREATION_PROCESSING)
      console.error(e)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeAction={closeAction}
      initialFocusRef={focusBtnRef}
    >
      <ModalHeaderTitle closeAction={closeAction} title="Confirm Farm" />
      <ModalContent>
        <div className="space-y-6">
          <div className="flex items-center px-4 py-2 mx-auto space-x-4 bg-surface-25 rounded-3xl w-fit">
            <FromToFarmTokenPair
              fromToken={fromToken}
              fromText={fromToken.symbol}
              toToken={toToken}
              toText={toToken.symbol}
            />
          </div>
          <div>
            <TitleText size={2} className="text-center text-em-low">
              Farms <span className="text-em-high">{toToken.symbol}</span>,
              swapping{" "}
              <span className="text-em-high">
                {amountPerOrder} {fromToken.symbol}
              </span>
              <br />
              <span className="text-em-high">
                every {FREQUENCY_OPTIONS[frequency]}
              </span>
            </TitleText>
          </div>
          <div className="w-full p-5 space-y-2 bg-surface-25 rounded-xl">
            <div className="flex items-center justify-between">
              <BodyText className="text-em-med">Starts on</BodyText>
              <BodyText>{format(startTime, "dd MMM yy, HH:mm")}</BodyText>
            </div>
            <div className="flex items-center justify-between">
              <BodyText className="text-em-med">Ends on</BodyText>
              <BodyText>{format(endTime, "dd MMM yy, HH:mm")}</BodyText>
            </div>
            <div className="flex items-center justify-between">
              <BodyText className="text-em-med">Total funds</BodyText>
              <BodyText className="text-end">
                {amount} {fromToken.symbol}
              </BodyText>
            </div>
            <div className="flex items-center justify-between">
              <BodyText className="text-em-med">One-time upfront fee</BodyText>
              <BodyText>0.45%</BodyText>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        {step === CREATE_FARM_STEPS.create && (
          <Button
            size="lg"
            variant="tertiary"
            onClick={closeAction}
            width="full"
          >
            Cancel
          </Button>
        )}
        {step === CREATE_FARM_STEPS.approve && (
          <Button
            size="lg"
            variant="primary"
            onClick={approveFromToken}
            width="full"
            ref={focusBtnRef}
            className="whitespace-nowrap"
          >
            Approve {fromToken.symbol}
          </Button>
        )}
        <Button
          size="lg"
          variant="primary"
          onClick={() => {
            createFarm()
          }}
          width="full"
          ref={focusBtnRef}
          disabled={step === CREATE_FARM_STEPS.approve}
        >
          Farm now
        </Button>
      </ModalFooter>
      <DialogConfirmTransactionLoading
        isOpen={isModalOpen(ModalId.FARM_APPROVE_PROCESSING)}
        title={approveTx && "Proceeding approval"}
        description={approveTx && "Waiting for transaction confirmation."}
      >
        {approveTx?.hash && chainId && (
          <TransactionLink chainId={chainId} hash={approveTx.hash} />
        )}
      </DialogConfirmTransactionLoading>
      <DialogConfirmTransactionLoading
        closeAction={() => closeModal(ModalId.FARM_CREATION_PROCESSING)}
        isOpen={isModalOpen(ModalId.FARM_CREATION_PROCESSING)}
        title={farmCreationTx && "Proceeding farm creation"}
        description={farmCreationTx && "Waiting for transaction confirmation."}
      >
        {farmCreationTx?.hash && chainId && (
          <TransactionLink chainId={chainId} hash={farmCreationTx.hash} />
        )}
      </DialogConfirmTransactionLoading>
    </Modal>
  )
}
