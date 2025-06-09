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
      address: "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54",
      startBlock: 72531791
    }
  },
  "arbitrum-one": {
    tradeFoundry: {
      address: "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54",
      startBlock: 345331464
    }
  },
  base: {
    tradeFoundry: {
      address: "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54",
      startBlock: 31315912
    }
  },
  gnosis: {
    tradeFoundry: {
      address: "0xD2e76eb1374E8A3DC75D6D76fBB6fB2D197dFE54",
      startBlock: 40485253
    }
  }
}
