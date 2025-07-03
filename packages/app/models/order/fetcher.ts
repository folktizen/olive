import {
  ChainId,
  getSubgraphEndpoint,
  getUserActiveOrders,
  getUserCancelledOrders,
  getUserCompleteOrders,
  getUserOrders
} from "@useolive/sdk"
import { GraphQLClient } from "graphql-request"

interface GetOrder {
  chainId: ChainId
  address: string
  skip?: number
  first?: number
  currentTimestamp: number
}

export async function getOrders(chainId: ChainId, address: string) {
  try {
    const graphqlClient = new GraphQLClient(getSubgraphEndpoint(chainId))
    const orders = await getUserOrders(graphqlClient, address)

    if (!orders) throw "Failed to fetch subgraph data"

    return orders
  } catch (e) {
    console.error(e)
  }
}

export async function getActiveOrders({
  chainId,
  address,
  currentTimestamp,
  skip,
  first
}: GetOrder) {
  try {
    const graphqlClient = new GraphQLClient(getSubgraphEndpoint(chainId))
    const orders = await getUserActiveOrders(
      graphqlClient,
      address,
      currentTimestamp,
      skip,
      first
    )

    if (!orders) throw "Failed to fetch active orders data from subgraph"

    return orders
  } catch (e) {
    console.error(e)
  }
}

export async function getCompleteOrders({
  chainId,
  address,
  currentTimestamp,
  skip,
  first
}: GetOrder) {
  try {
    const graphqlClient = new GraphQLClient(getSubgraphEndpoint(chainId))
    const orders = await getUserCompleteOrders(
      graphqlClient,
      address,
      currentTimestamp,
      skip,
      first
    )

    if (!orders) throw "Failed to fetch active orders data from subgraph"

    return orders
  } catch (e) {
    console.error(e)
  }
}

export async function getCancelledOrders({
  chainId,
  address,
  skip,
  first
}: GetOrder) {
  try {
    const graphqlClient = new GraphQLClient(getSubgraphEndpoint(chainId))
    const orders = await getUserCancelledOrders(
      graphqlClient,
      address,
      skip,
      first
    )

    if (!orders) throw "Failed to fetch cancelled orders data from subgraph"

    return orders
  } catch (e) {
    console.error(e)
  }
}
