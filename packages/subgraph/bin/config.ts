export const config: Record<
  string,
  {
    orderFactory: {
      address: string
      startBlock: number
    }
  }
> = {
  mainnet: {
    orderFactory: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  },
  matic: {
    orderFactory: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  },
  "arbitrum-one": {
    orderFactory: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  },
  base: {
    orderFactory: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  },
  gnosis: {
    orderFactory: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  }
}
