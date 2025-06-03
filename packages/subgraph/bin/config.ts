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
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 72291035
    }
  },
  "arbitrum-one": {
    orderFactory: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 343288329
    }
  },
  base: {
    orderFactory: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 31059052
    }
  },
  xdai: {
    orderFactory: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 40384918
    }
  }
}
