import { ChainId } from "../constants"
import { Token } from "./token"

export const USDC: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6,
    "USDC"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    6,
    "USDC"
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    6,
    "USDC"
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    6,
    "USDC"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  //   6,
  //   "USDC"
  // ),
  // [ChainId.AVALANCHE]: new Token(
  //   ChainId.AVALANCHE,
  //   "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  //   6,
  //   "USDC"
  // )
}

export const SETH2 = new Token(
  ChainId.ETHEREUM,
  "0xFe2e637202056d30016725477c5da089Ab0A043A",
  18,
  "sETH2"
)

export const RETH2 = new Token(
  ChainId.ETHEREUM,
  "0x20bc832ca081b91433ff6c17f85701b6e92486c5",
  18,
  "rETH2"
)

export const WETH: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    "0x4200000000000000000000000000000000000006",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
    18,
    "WETH",
    "Wrapped Ether"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  //   18,
  //   "WETH",
  //   "Wrapped Ether"
  // ),
  // [ChainId.AVALANCHE]: new Token(
  //   ChainId.AVALANCHE,
  //   "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  //   18,
  //   "WETH.e",
  //   "Wrapped Ether"
  // )
}

// export const WPOL = new Token(
//   ChainId.POLYGON,
//   "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
//   18,
//   "WPOL",
//   "Wrapped POL"
// )

// export const WAVAX = new Token(
//   ChainId.AVALANCHE,
//   "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
//   18,
//   "WAVAX",
//   "Wrapped AVAX"
// )

export const WXDAI = new Token(
  ChainId.GNOSIS,
  "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
  18,
  "WXDAI",
  "Wrapped xDAI"
)

export const USDS: Record<Exclude<ChainId, ChainId.GNOSIS>, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
    18,
    "USDS",
    "USDS Stablecoin"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0x6491c05A82219b8D1479057361ff1654749b876b",
    18,
    "USDS",
    "USDS Stablecoin"
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    "0x820C137fa70C8691f0e44Dc420a5e53c168921Dc",
    18,
    "USDS",
    "USDS Stablecoin"
  )
}

export const DAI: Record<Exclude<ChainId, ChainId.GNOSIS>, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18,
    "DAI",
    "Dai Stablecoin"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    18,
    "DAI",
    "Dai Stablecoin"
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    18,
    "DAI",
    "Dai Stablecoin"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  //   18,
  //   "DAI",
  //   "Dai Stablecoin"
  // ),
  // [ChainId.AVALANCHE]: new Token(
  //   ChainId.AVALANCHE,
  //   "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  //   18,
  //   "DAI.e",
  //   "Dai Stablecoin"
  // )
}

export const GNO: Record<Exclude<ChainId, ChainId.BASE>, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0x6810e776880c02933d47db1b9fc05908e5386b96",
    18,
    "GNO"
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
    18,
    "GNO"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1",
    18,
    "GNO"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x5FFD62D3C3eE2E81C00A7b9079FB248e7dF024A8",
  //   18,
  //   "GNO"
  // )
}

export const WBTC: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    8,
    "WBTC"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    8,
    "WBTC"
  ),
  [ChainId.BASE]: new Token(
    ChainId.BASE,
    "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    8,
    "WBTC"
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    "0x8e5bbbb09ed1ebde8674cda39a0c169401db4252",
    8,
    "WBTC"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  //   8,
  //   "WBTC",
  //   "Wrapped BTC"
  // ),
  // [ChainId.AVALANCHE]: new Token(
  //   ChainId.AVALANCHE,
  //   "0x50b7545627a5162F82A992c33b87aDc75187B218",
  //   8,
  //   "WBTC.e"
  // )
}

export const DPI: Record<Exclude<ChainId, ChainId.BASE>, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    "0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b",
    18,
    "DPI"
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    "0xd3d47d5578e55c880505dc40648f7f9307c3e7a8",
    18,
    "DPI"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    "0x9737C658272e66Faad39D7AD337789Ee6D54F500",
    18,
    "DPI"
  )
  // [ChainId.POLYGON]: new Token(
  //   ChainId.POLYGON,
  //   "0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369",
  //   18,
  //   "DPI"
  // )
}

export const STETH = new Token(
  ChainId.ETHEREUM,
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  18,
  "stETH"
)

export const RETH = new Token(
  ChainId.ETHEREUM,
  "0xae78736cd615f374d3085123a210448e74fc6393",
  18,
  "rETH"
)

export const USDT = new Token(
  ChainId.ETHEREUM,
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  6,
  "USDT"
)

export const LUSD = new Token(
  ChainId.ETHEREUM,
  "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
  18,
  "LUSD"
)

export const SUSD = new Token(
  ChainId.ETHEREUM,
  "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
  18,
  "SUSD"
)

export const ENS = new Token(
  ChainId.ETHEREUM,
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
  18,
  "ENS"
)
