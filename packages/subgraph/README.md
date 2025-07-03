# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| **Network**  | **Deployment Name** | **Subgraph Endpoint**                                                                                              |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Ethereum     | olv-on-ethereum     | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-ethereum/1.2.0-komodo/gn     |
| Arbitrum One | olv-on-arbitrum-one | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-arbitrum-one/1.2.0-komodo/gn |
| Polygon      | olv-on-polygon      | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-polygon/1.2.0-komodo/gn      |
| Base         | olv-on-base         | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-base/1.2.0-komodo/gn         |
| Gnosis       | olv-on-gnosis       | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-gnosis/1.2.0-komodo/gn       |
| Avalanche    | olv-on-avalanche    | https://api.goldsky.com/api/public/project_clphol9357ef601utg9cgegtg/subgraphs/olv-on-avalanche/1.2.0-komodo/gn    |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `yarn deploy:arbitrum-one`).
