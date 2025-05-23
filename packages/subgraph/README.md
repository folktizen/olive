# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| Network      | Deployment Name | Subgraph Endpoint                                                                    |
| ------------ | --------------- | ------------------------------------------------------------------------------------ |
| Ethereum     | olive-ethereum  | https://thegraph.com/explorer/subgraphs/8VW4Bb2m7X3m94m888jWkVqbQRcgdK6r2VXfKUdQRfnh |
| Optimism     | olive-optimism  | https://thegraph.com/explorer/subgraphs/ArKQXogjhyMCE9vSW4ZsCNQdxdJHgWrWXsEHZFSfcKui |
| Arbitrum One | olive-arbitrum  | https://thegraph.com/explorer/subgraphs/BYm6xU4ktboxM18hFmAG9X7S1CR4QRCGpjueJCydWxtP |
| Polygon      | olive-polygon   | N/A                                                                                  |
| Base         | olive-base      | https://thegraph.com/explorer/subgraphs/zLmPzDFu6aUXohRg1Jj56Y6Ywz7Y8JaFawTDxeCeDog  |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `bun run deploy:arbitrum-one`).
