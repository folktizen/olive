# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| Network      | Deployment Name | Subgraph Endpoint                                                                    |
| ------------ | --------------- | ------------------------------------------------------------------------------------ |
| Optimism     | olive-optimism  | https://thegraph.com/explorer/subgraphs/7D2Lnn1562fHFzN1XbMoBuV69r6LANobSkECn4FDcqpL |
| Arbitrum One | olive-arbitrum  | https://thegraph.com/explorer/subgraphs/BYm6xU4ktboxM18hFmAG9X7S1CR4QRCGpjueJCydWxtP |
| Polygon      | olive-polygon   | https://thegraph.com/explorer/subgraphs/AGweV5aTNnQ4N8wZBXFZEQAcSxUHa3F4WXi6tLkho2Bw |
| Base         | olive-base      | https://thegraph.com/explorer/subgraphs/zLmPzDFu6aUXohRg1Jj56Y6Ywz7Y8JaFawTDxeCeDog  |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `bun run deploy:arbitrum-one`).
