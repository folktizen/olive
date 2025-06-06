"use client"

import { ReactNode, createContext, useContext, useMemo } from "react"

import { ChainId } from "@useolive/sdk"
import {
  Options,
  createParser,
  parseAsString,
  parseAsStringEnum,
  parseAsTimestamp,
  useQueryState
} from "next-usequerystate"

import {
  TokenWithBalance,
  useNetworkContext,
  useStrategyContext,
  useTokenListContext
} from "@/contexts"
import { FREQUENCY_OPTIONS } from "@/models/farm"
import { DEFAULT_TOKENS_BY_CHAIN, checkIsValidChainId } from "@/utils"

const endDateByFrequency: Record<string, number> = {
  [FREQUENCY_OPTIONS.hour]: new Date().setDate(new Date().getDate() + 2),
  [FREQUENCY_OPTIONS.day]: new Date().setMonth(new Date().getMonth() + 1),
  [FREQUENCY_OPTIONS.week]: new Date().setMonth(new Date().getMonth() + 3),
  [FREQUENCY_OPTIONS.month]: new Date().setFullYear(
    new Date().getFullYear() + 1
  )
}

const startDateParseAsTimestamp = createParser({
  parse: (v) => {
    const ms = parseInt(v)
    if (Number.isNaN(ms)) {
      return null
    }

    const searchParamsStartDate = new Date(ms)
    const nowDate = new Date()

    if (nowDate.getTime() > searchParamsStartDate.getTime()) return nowDate

    return new Date(ms)
  },
  serialize: (v: Date) => v.valueOf().toString()
})

const throwFarmboxFormContextError = () => {
  throw new Error("No FarmboxFormContext available")
}

type FarmboxFormStateInput<T> = [
  T,
  <Shallow>(
    value: T | ((old: T) => T | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>
]

interface FarmboxFormContextProps {
  resetFormValues: (newChainId: ChainId) => void
  farmboxFormState: {
    fromTokenState: FarmboxFormStateInput<TokenWithBalance>
    toTokenState: FarmboxFormStateInput<TokenWithBalance>
    tokenAmountState: FarmboxFormStateInput<string>
    frequencyState: FarmboxFormStateInput<FREQUENCY_OPTIONS>
    startDateState: FarmboxFormStateInput<Date>
    endDateState: FarmboxFormStateInput<Date>
  }
}

const FarmboxFormContext = createContext<FarmboxFormContextProps>({
  resetFormValues: throwFarmboxFormContextError,
  farmboxFormState: null as any
})

interface FarmboxFormContextProviderProps {
  children: ReactNode
}

export const FarmboxFormContextProvider = ({
  children
}: FarmboxFormContextProviderProps) => {
  const { chainId } = useNetworkContext()
  const { deselectStrategy } = useStrategyContext()
  const { getTokenFromList } = useTokenListContext()

  const getDefaultParsedToken = (tokenDirection: "to" | "from") => {
    const validChainId = checkIsValidChainId(chainId)
      ? chainId
      : ChainId.ARBITRUM

    return createParser({
      parse: (address: string) => getTokenFromList(address),
      serialize: (token) => token?.address || ""
    }).withDefault(DEFAULT_TOKENS_BY_CHAIN[validChainId][tokenDirection])
  }

  const [fromToken, setFromToken] = useQueryState<TokenWithBalance>(
    "fromToken",
    getDefaultParsedToken("from")
  )
  const [toToken, setToToken] = useQueryState<TokenWithBalance>(
    "toToken",
    getDefaultParsedToken("to")
  )
  const [tokenAmount, setTokenAmount] = useQueryState(
    "tokenAmount",
    parseAsString.withDefault("")
  )
  const [frequency, setFrequency] = useQueryState(
    "frequency",
    parseAsStringEnum<FREQUENCY_OPTIONS>(
      Object.values(FREQUENCY_OPTIONS)
    ).withDefault(FREQUENCY_OPTIONS.hour)
  )
  const [startDateTime, setStartDateTime] = useQueryState(
    "startDate",
    startDateParseAsTimestamp.withDefault(new Date(Date.now()))
  )
  const [endDateTime, setEndDateTime] = useQueryState(
    "endDate",
    parseAsTimestamp.withDefault(new Date(endDateByFrequency[frequency]))
  )
  const farmboxFormContext = useMemo(() => {
    const resetFormValues = (newChainId: ChainId) => {
      const validChainId = checkIsValidChainId(newChainId)
        ? newChainId
        : ChainId.ARBITRUM

      deselectStrategy()
      setFromToken(DEFAULT_TOKENS_BY_CHAIN[validChainId].from)
      setToToken(DEFAULT_TOKENS_BY_CHAIN[validChainId].to)
      setTokenAmount("0.0")
      setFrequency(FREQUENCY_OPTIONS.hour)
      setStartDateTime(new Date(Date.now()))
      setEndDateTime(new Date(endDateByFrequency[frequency]))
    }

    const farmboxFormState = {
      fromTokenState: [
        fromToken,
        setFromToken
      ] as FarmboxFormStateInput<TokenWithBalance>,
      toTokenState: [
        toToken,
        setToToken
      ] as FarmboxFormStateInput<TokenWithBalance>,
      tokenAmountState: [
        tokenAmount,
        setTokenAmount
      ] as FarmboxFormStateInput<string>,
      frequencyState: [
        frequency,
        setFrequency
      ] as FarmboxFormStateInput<FREQUENCY_OPTIONS>,
      startDateState: [
        startDateTime,
        setStartDateTime
      ] as FarmboxFormStateInput<Date>,
      endDateState: [endDateTime, setEndDateTime] as FarmboxFormStateInput<Date>
    }

    return {
      resetFormValues,
      farmboxFormState
    }
  }, [
    deselectStrategy,
    endDateTime,
    frequency,
    fromToken,
    setEndDateTime,
    setFrequency,
    setFromToken,
    setStartDateTime,
    setToToken,
    setTokenAmount,
    startDateTime,
    toToken,
    tokenAmount
  ])

  return (
    <FarmboxFormContext.Provider value={farmboxFormContext}>
      {children}
    </FarmboxFormContext.Provider>
  )
}

export const useFarmboxFormContext = () => useContext(FarmboxFormContext)
