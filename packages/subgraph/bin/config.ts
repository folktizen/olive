export const config: Record<
  string,
  {
    orderFactory: {
      address: string
      startBlock: number
    }
  }
> = {
  "arbitrum-one": {
    orderFactory: {
      address: "0x8B30d482FB833813e3db9f6D96516e31763df3b8",
      startBlock: 341027196
    }
  },
  base: {
    orderFactory: {
      address: "0x8B30d482FB833813e3db9f6D96516e31763df3b8",
      startBlock: 30774887
    }
  }
}
