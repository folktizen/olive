export const config: Record<
  string,
  {
    tradeFoundry: {
      address: string
      startBlock: number
    }
  }
> = {
  mainnet: {
    tradeFoundry: {
      address: "0x0000000000000000000000000000000000000000",
      startBlock: 0
    }
  },
  matic: {
    tradeFoundry: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 72291035
    }
  },
  "arbitrum-one": {
    tradeFoundry: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 343288329
    }
  },
  base: {
    tradeFoundry: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 31059052
    }
  },
  xdai: {
    tradeFoundry: {
      address: "0x1CDe26c1C4fCE219109B245F456e6BaAf1d543C0",
      startBlock: 40384918
    }
  }
}
