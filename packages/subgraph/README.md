# Olive Subgraph

This package contains the subgraph for the Olive protocol, deployed to The Graph on multiple EVM networks.

## Deployed Subgraphs

| **Network**  | **Deployment Name** | **Subgraph Endpoint**                                                                      |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------ |
| Ethereum     | olv-on-ethereum     | https://gateway.thegraph.com/api/subgraphs/id/BGTa3vq2SaxHfJ2wHpbGr5hefBdcuVEapJYwXQTcXYnQ |
| Arbitrum One | olv-on-arbitrum-one | https://gateway.thegraph.com/api/subgraphs/id/3HQAS3YAKUHFTiBdKuuQCTR8uyvaA7rDnEYcRNS5RZGP |
| Polygon      | olv-on-polygon      | https://gateway.thegraph.com/api/subgraphs/id/7pEwWh39RCYcZPY2az5EWfYJ9Zkasn4bCC4Dc15qEaaj |
| Base         | olv-on-base         | https://gateway.thegraph.com/api/subgraphs/id/GG4e2XbzE99BGMGmPzBz5p6KkHndRtpEu9nFiiJjvoCY |
| Gnosis       | olv-on-gnosis       | https://gateway.thegraph.com/api/subgraphs/id/3EMgJeaUuRrKSSy1NHdCw4p1ytgRbgWRQBkqqbKHxJ4U |
| Avalanche    | olv-on-avalanche    | https://gateway.thegraph.com/api/subgraphs/id/7dh9zFA4DHLrePG917RTHQoUP94BJXMxc7nHxfhWYZ4u |

- For the latest contract addresses and start blocks, see `bin/config.ts`.
- To deploy or update a subgraph, use the scripts in `package.json` (e.g., `yarn deploy:arbitrum-one`).
