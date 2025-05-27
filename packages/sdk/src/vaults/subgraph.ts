import { gql, GraphQLClient } from "graphql-request"

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Token = {
  __typename?: "Token"
  /**  Token address  */
  id: Scalars["ID"]
  /**  Token address  */
  address: Scalars["String"]
  /**  Number of decimals the token uses  */
  decimals: Scalars["Int"]
  /**  Human-readable name of the token  */
  name: Scalars["String"]
  /**  Symbol of the token  */
  symbol: Scalars["String"]
}

export type Order = {
  __typename?: "Order"
  /**  Order address  */
  id: Scalars["ID"]
  /** Order owner */
  owner: Scalars["String"]
  sellToken: Token
  buyToken: Token
  /**  Amount of the vault  */
  amount: Scalars["Float"]
  /**  Olive fees  */
  feeAmount: Scalars["Float"]
  fee: Scalars["Float"]
  /**  Start time of the vault  */
  startTime: Scalars["Int"]
  /**  End time of the vault  */
  endTime: Scalars["Int"]
  /**  Order creation time  */
  createdAt: Scalars["Int"]
  cancelledAt?: Maybe<Scalars["Int"]>
  orderSlots: string[]
  interval: Scalars["Int"]
}

const OrderFragment = gql`
  fragment OrderFragment on DCAOrder {
    id
    owner
    receiver
    amount
    fee
    feeAmount
    sellToken {
      address: id
      decimals
      name
      symbol
    }
    buyToken {
      address: id
      decimals
      name
      symbol
    }
    createdAt
    startTime
    endTime
    orderSlots
    cancelledAt
    interval
  }
`

const getUserOrdersQuery = gql`
  query getUserOrders($userAddress: String!) {
    orders: dcaorders(
      where: { owner: $userAddress }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`

const getUserActiveOrdersQuery = gql`
  query getUserOrders(
    $userAddress: String!
    $first: Int = 20
    $skip: Int = 0
    $currentTimestamp: Int!
  ) {
    orders: dcaorders(
      where: {
        owner: $userAddress
        cancelledAt: null
        endTime_gt: $currentTimestamp
      }
      first: $first
      skip: $skip
      limit: 10
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`

const getUserCompleteOrdersQuery = gql`
  query getUserOrders(
    $userAddress: String!
    $first: Int = 20
    $skip: Int = 0
    $currentTimestamp: Int!
  ) {
    orders: dcaorders(
      where: {
        owner: $userAddress
        cancelledAt: null
        endTime_lt: $currentTimestamp
      }
      first: $first
      skip: $skip
      limit: 10
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`

const getUserCancelledOrdersQuery = gql`
  query getUserOrders($userAddress: String!, $first: Int = 20, $skip: Int = 0) {
    orders: dcaorders(
      where: { owner: $userAddress, cancelledAt_not: null }
      first: $first
      skip: $skip
      limit: 10
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`

const getOrderQuery = gql`
  query getOrder($orderAddress: ID!) {
    order: dcaorder(id: $orderAddress) {
      ...OrderFragment
    }
  }
  ${OrderFragment}
`

/**
 * Get all orders for a user from the subgraph
 * @param client - GraphQL client
 * @param userAddress - User address
 * @returns
 */
export async function getUserOrders(
  client: GraphQLClient,
  userAddress: string
) {
  const response = await client.request<{
    orders: Order[]
  }>(getUserOrdersQuery, {
    userAddress: userAddress.toLowerCase()
  })

  return response.orders
}
/**
 * Get all orders for a user from the subgraph
 * @param client - GraphQL client
 * @param userAddress - User address
 * @param currentTimestamp - Current Timesamp
 * @param skip - items to skip (optinal, default: 0)
 * @param first - how many items to get (optinal, default: 20)
 * @returns
 */
export async function getUserActiveOrders(
  client: GraphQLClient,
  userAddress: string,
  currentTimestamp: number,
  skip?: number,
  first?: number
) {
  const response = await client.request<{
    orders: Order[]
  }>(getUserActiveOrdersQuery, {
    userAddress: userAddress.toLowerCase(),
    currentTimestamp: currentTimestamp,
    skip: skip,
    first: first
  })

  return response.orders
}

/**
 * Get all orders for a user from the subgraph
 * @param client - GraphQL client
 * @param userAddress - User address
 * @param currentTimestamp - Current Timesamp
 * @param skip - items to skip (optinal, default: 0)
 * @param first - how many items to get (optinal, default: 20)
 * @returns
 */
export async function getUserCompleteOrders(
  client: GraphQLClient,
  userAddress: string,
  currentTimestamp: number,
  skip?: number,
  first?: number
) {
  const response = await client.request<{
    orders: Order[]
  }>(getUserCompleteOrdersQuery, {
    userAddress: userAddress.toLowerCase(),
    currentTimestamp: currentTimestamp,
    skip: skip,
    first: first
  })

  return response.orders
}

/**
 * Get all orders for a user from the subgraph
 * @param client - GraphQL client
 * @param userAddress - User address
 * @param skip - items to skip (optinal, default: 0)
 * @param first - how many items to get (optinal, default: 20)
 * @returns
 */
export async function getUserCancelledOrders(
  client: GraphQLClient,
  userAddress: string,
  skip?: number,
  first?: number
) {
  const response = await client.request<{
    orders: Order[]
  }>(getUserCancelledOrdersQuery, {
    userAddress: userAddress.toLowerCase(),
    skip: skip,
    first: first
  })

  return response.orders
}

/**
 * Get all vaults for a user from the subgraph
 * @param client - GraphQL client
 * @param orderAddress - Order proxy address
 * @returns
 */
export async function getOrder(client: GraphQLClient, orderAddress: string) {
  const response = await client.request<{
    order: Order
  }>(getOrderQuery, {
    orderAddress: orderAddress.toLowerCase()
  })

  return response.order
}
