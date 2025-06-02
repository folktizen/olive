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
      address: "0xddBa1edcd5e0735bdF00C063a397B0580d48acB5",
      startBlock: 72162068
    }
  },
  "arbitrum-one": {
    orderFactory: {
      address: "0xdbc1c767C6C8ea9455AE29Bf0b10b18AF00EeE35",
      startBlock: 342191923
    }
  },
  base: {
    orderFactory: {
      address: "0x14b4Bc25e5AcA0FdF048C7Cc93bb26513491e4d8",
      startBlock: 30920696
    }
  },
  xdai: {
    orderFactory: {
      address: "0x04d420c7f865869835267ebd2C99a1F2daFF9482",
      startBlock: 40331125
    }
  }
}
