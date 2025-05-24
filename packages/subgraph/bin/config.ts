export const config: Record<
  string,
  {
    orderFactory: {
      address: string;
      startBlock: number;
    };
  }
> = {
  optimism: {
    orderFactory: {
      address: "0xf754a9e276F4f1D385e9515Ec8bEbf6c00C0BB0A",
      startBlock: 136228273,
    },
  },
  "arbitrum-one": {
    orderFactory: {
      address: "0xf754a9e276F4f1D385e9515Ec8bEbf6c00C0BB0A",
      startBlock: 339895459,
    },
  },
  matic: {
    orderFactory: {
      address: "0xf754a9e276F4f1D385e9515Ec8bEbf6c00C0BB0A",
      startBlock: 71892196,
    },
  },
  base: {
    orderFactory: {
      address: "0xf754a9e276F4f1D385e9515Ec8bEbf6c00C0BB0A",
      startBlock: 30633015,
    },
  },
};
