"use client"

import { Tab } from "@headlessui/react"
import { useCallback, useEffect, useState } from "react"

import { EmptyState, FarmsTable, tabButtonStyles } from "@/components"
import { PATHNAMES } from "@/constants"
import {
  getActiveOrders,
  getCancelledOrders,
  getCompleteOrders,
  getOrders
} from "@/models/order"
import {
  FarmOrder,
  filterActiveOrders,
  filterCancelledOrders,
  filterCompletedOrders,
  getFarmOrders
} from "@/models/farm-order"
import { ButtonLink, HeadingText } from "@/ui"
import { currentTimestampInSeconds } from "@/utils"
import { ChainId, Order } from "@useolive/sdk"
import EmptyStatePage from "./empty-state"

type SortTime = "startTime" | "endTime" | "cancelledAt"

const sortedOrdersByTime = (orders: FarmOrder[], time: SortTime) =>
  orders.sort((a, b) => Number(b[time]) - Number(a[time]))

interface FetcherParams {
  chainId: ChainId
  address: string
  currentTimestamp: number
  skip?: number
  first?: number
}

interface OrderByState {
  orders: FarmOrder[]
  emptyText: string
  sort: SortTime
  numberOfPages: number
  fetcher: (params: FetcherParams) => Promise<any>
}

export interface FarmOrdersProps {
  address: string
  chainId: ChainId
}

type FarmStateIndex = 0 | 1 | 2

const ITEMS_PER_PAGE = 10

export const FarmOrders = ({ chainId, address }: FarmOrdersProps) => {
  const [loadingAllFarms, setLoadingAllFarms] = useState(true)
  const [loadingFarms, setLoadingFarms] = useState(true)

  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [farmStateIndex, setFarmStateIndex] = useState<FarmStateIndex>(0)
  const [currentFarmOrders, setCurrentFarmOrders] = useState<FarmOrder[]>([])

  const resetState = () => {
    setLoadingFarms(true)
    setCurrentPage(1)
  }

  const totalFarmsNumber = allOrders.length

  const totalFarmsActive = filterActiveOrders(allOrders).length
  const farmActiveTotalPages =
    totalFarmsActive > ITEMS_PER_PAGE ? totalFarmsActive / ITEMS_PER_PAGE : 1

  const totalFarmsComplete = filterCompletedOrders(allOrders).length
  const farmCompletedTotalPages =
    totalFarmsComplete > ITEMS_PER_PAGE
      ? totalFarmsComplete / ITEMS_PER_PAGE
      : 1

  const totalFarmsCancelled = filterCancelledOrders(allOrders).length
  const farmCancelledTotalPages =
    totalFarmsCancelled > ITEMS_PER_PAGE
      ? totalFarmsCancelled / ITEMS_PER_PAGE
      : 1

  const skipItems = (currentPage - 1) * ITEMS_PER_PAGE

  const hasMorePages = (numberOfPages: number) => numberOfPages > currentPage
  const hasLessPages = currentPage > 1

  const nextPage = (numberOfPages: number) => {
    if (hasMorePages(numberOfPages)) {
      setCurrentPage(currentPage + 1)
      setLoadingFarms(true)
    }
  }

  const previousPage = () => {
    if (hasLessPages) {
      setCurrentPage(currentPage - 1)
      setLoadingFarms(true)
    }
  }

  const ordersByState: OrderByState[] = [
    {
      orders: currentFarmOrders,
      emptyText: "No active farms",
      sort: "startTime",
      fetcher: getActiveOrders,
      numberOfPages: farmActiveTotalPages
    },
    {
      orders: currentFarmOrders,
      emptyText: "No complete farms",
      sort: "endTime",
      fetcher: getCompleteOrders,
      numberOfPages: farmCompletedTotalPages
    },
    {
      orders: currentFarmOrders,
      emptyText: "No cancelled farms",
      sort: "cancelledAt",
      fetcher: getCancelledOrders,
      numberOfPages: farmCancelledTotalPages
    }
  ]

  const fetchAllOrders = useCallback(() => {
    getOrders(chainId, address.toLowerCase())
      .then(async (orders) => {
        if (!orders || orders.length === 0) setAllOrders([])
        else {
          setAllOrders(orders)
        }
      })
      .finally(() => setLoadingAllFarms(false))
  }, [address, chainId])

  useEffect(() => {
    fetchAllOrders()
  }, [fetchAllOrders])

  const fetchFarms = useCallback(
    (farmStateIndex: FarmStateIndex) => {
      ordersByState[farmStateIndex]
        .fetcher({
          chainId: chainId,
          address: address.toLowerCase(),
          currentTimestamp: currentTimestampInSeconds,
          skip: skipItems,
          first: ITEMS_PER_PAGE
        })
        .then(async (orders) => {
          if (!orders || orders.length === 0) setCurrentFarmOrders([])
          else {
            const farmOrders = await getFarmOrders(chainId, orders)

            setCurrentFarmOrders(farmOrders?.length ? farmOrders : [])
          }
        })
        .finally(() => setLoadingFarms(false))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, chainId, currentPage]
  )

  useEffect(() => fetchFarms(farmStateIndex), [fetchFarms, farmStateIndex])

  if (!loadingFarms && !loadingAllFarms && allOrders.length === 0)
    return <EmptyStatePage />

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeadingText size={3}>Your Farms</HeadingText>
          {!loadingAllFarms && (
            <div className="px-2 py-1 text-xs font-semibold bg-surface-75 rounded-xl">
              {totalFarmsNumber}
            </div>
          )}
        </div>
        <ButtonLink
          iconLeft="plus"
          href={PATHNAMES.HOME}
          className="hidden sm:flex"
        >
          Create New Farm
        </ButtonLink>
      </div>
      <div className="space-y-6">
        <Tab.Group
          onChange={(index) => {
            setFarmStateIndex(index as FarmStateIndex)
            resetState()
          }}
        >
          <Tab.List>
            <div className="flex space-x-2">
              <Tab as="button" className={tabButtonStyles}>
                Active <span className="ml-1 text-xs">{totalFarmsActive}</span>
              </Tab>
              <Tab as="button" className={tabButtonStyles}>
                Completed{" "}
                <span className="ml-1 text-xs">{totalFarmsComplete}</span>
              </Tab>
              <Tab as="button" className={tabButtonStyles}>
                Cancelled{" "}
                <span className="ml-1 text-xs">{totalFarmsCancelled}</span>
              </Tab>
            </div>
          </Tab.List>
          <Tab.Panels>
            {loadingFarms ? (
              <EmptyState className="animate-pulse" text="Loading..." />
            ) : (
              <>
                {ordersByState.map((farms, index) => (
                  <Tab.Panel key={farms.emptyText}>
                    {farms.orders.length ? (
                      <FarmsTable
                        hasMorePages={hasMorePages(farms.numberOfPages)}
                        hasLessPages={hasLessPages}
                        nextPage={() => nextPage(farms.numberOfPages)}
                        previousPage={previousPage}
                        farmOrders={sortedOrdersByTime(
                          farms.orders,
                          farms.sort
                        )}
                        fetchAllOrders={fetchAllOrders}
                        refetchFarms={() =>
                          fetchFarms(index as FarmStateIndex)
                        }
                      />
                    ) : (
                      <EmptyState text={farms.emptyText} />
                    )}
                  </Tab.Panel>
                ))}
              </>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}
