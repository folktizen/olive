# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| **Network**  | **Deployment Name** | **Subgraph Endpoint**                                                                                       |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Ethereum     | olv-on-ethereum     | <!-- WIP -->                                                                                                |
| Polygon      | olv-on-polygon      | https://gateway.thegraph.com/api/subgraphs/id/7pEwWh39RCYcZPY2az5EWfYJ9Zkasn4bCC4Dc15qEaaj                  |
| Arbitrum One | olv-on-arbitrum-one | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-arbitrum-one/atlas/gn |
| Base         | olv-on-base         | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-base/atlas/gn         |
| Gnosis       | olv-on-gnosis       | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-gnosis/atlas/gn       |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `bun run deploy:arbitrum-one`).
