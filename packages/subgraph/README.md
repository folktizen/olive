# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| Network      | Deployment Name       | Subgraph Endpoint                                                                         |
| ------------ | --------------------- | ----------------------------------------------------------------------------------------- |
| Arbitrum One | olive-on-arbitrum-one | https://subgraph.satsuma-prod.com/55155b15c6b1/funtend--3839364/olive-on-arbitrum-one/api |
| Base         | olive-on-base         | https://subgraph.satsuma-prod.com/55155b15c6b1/funtend--3839364/olive-on-base/api         |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `bun run deploy:arbitrum-one`).
