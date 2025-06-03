# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| **Network**  | **Deployment Name** | **Subgraph Endpoint**                                                                                       |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Ethereum     | olv-on-ethereum     | <!-- WIP -->                                                                                                |
| Polygon      | olv-on-polygon      | https://subgraph.satsuma-prod.com/55155b15c6b1/funtend--3839364/olv-on-polygon/api                          |
| Arbitrum One | olv-on-arbitrum-one | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-arbitrum-one/atlas/gn |
| Base         | olv-on-base         | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-base/atlas/gn         |
| Gnosis       | olv-on-gnosis       | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-gnosis/atlas/gn       |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `bun run deploy:arbitrum-one`).
