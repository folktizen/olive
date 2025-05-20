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
      address: "0xefc25aa869B78DcF9A33De4D39bD09C6B6F916dF",
      startBlock: 136062765,
    },
  },
  polygon: {
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
