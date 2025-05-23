export const config: Record<
  string,
  {
    orderFactory: {
      address: string;
      startBlock: number;
    };
  }
> = {
  mainnet: {
    orderFactory: {
      address: "0x01c4B69C897C8936B7F0E361d91e2C78F35082A5",
      startBlock: 22527750,
    },
  },
  optimism: {
    orderFactory: {
      address: "0xefc25aa869B78DcF9A33De4D39bD09C6B6F916dF",
      startBlock: 136062765,
    },
  },
  "arbitrum-one": {
    orderFactory: {
      address: "0xb31BA189b09F82C8920E7f7144e81dFfE85fFBa6",
      startBlock: 339477623,
    },
  },
  matic: {
    orderFactory: {
      address: "0x2884Fb2b529Cff99906E2521DF6328EEEfFdeea8",
      startBlock: 71739422,
    },
  },
  base: {
    orderFactory: {
      address: "0x61d1C74DA0bdA3b26bC54Dc742Cf0bb88dCb8122",
      startBlock: 30467493,
    },
  },
};
