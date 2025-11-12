# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Olive is a Next.js monorepo implementing Dollar Cost Averaging (DCA) using the CoW Protocol. The project enables users to create automated, recurring token swaps ("farms") at custom intervals (hourly, daily, weekly, monthly) using smart contracts on multiple EVM chains.

**Key Technologies:**
- Next.js 13+ (App Router)
- TypeScript
- Solidity (Foundry)
- The Graph (Subgraphs)
- Wagmi/Viem for web3 interactions
- Turbo for monorepo orchestration

## Architecture

### Monorepo Structure

The project uses Yarn workspaces with 5 packages:

1. **`packages/contracts/`** - Solidity smart contracts built with Foundry
   - `DCAFarm.sol`: Conditional order contract (deployed as minimal proxies)
   - `TradeFoundry.sol`: Factory for creating DCAFarm orders with protocol fees
   - Uses OpenZeppelin and Gnosis CoW Protocol v2 dependencies

2. **`packages/sdk/`** - TypeScript SDK for interacting with contracts
   - Generated TypeChain types from contract ABIs
   - Chain-specific constants (addresses, subgraph endpoints)
   - Core entities and vault logic
   - **Must run `yarn typechain` before building**

3. **`packages/subgraph/`** - The Graph indexers per chain
   - Tracks DCAFarm and order events
   - Multi-network support (Ethereum, Arbitrum, Base, Gnosis)
   - Built with chain-specific configs using `bin/build-subgraph.ts`

4. **`packages/web/`** - Next.js frontend application
   - App Router architecture
   - ConnectKit + Wagmi for wallet connections
   - React Context for state management (FarmboxFormContext, NetworkContext, ModalContext, etc.)
   - Uses path alias `@/*` for imports

5. **`packages/config/`** - Shared Prettier configuration

### Smart Contract Flow

1. User creates a farm through `TradeFoundry.createOrderWithNonce()`
2. TradeFoundry deploys a minimal proxy of the `DCAFarm` singleton
3. DCAFarm initializes with parameters (tokens, amounts, dates, interval)
4. User approves sell token for CoW's vault relayer
5. CoW Protocol watchers detect `ConditionalOrderCreated` event
6. Orders execute automatically at specified intervals via `getTradeableOrder()`
7. Orders are time-bucketed in 15-minute windows to prevent spam

### Web Application Flow

- Context hierarchy: WagmiProvider → QueryClientProvider → ConnectKitProvider → NetworkContext → TokenListProvider → ModalContext → StrategyContext → FarmboxFormContext
- Main pages: `/` (landing) and `/farms` (user's active farms)
- Farmbox component handles farm creation form with token selection, amount, frequency, and dates
- FarmsTable shows user's active farms with progress tracking
- Network switching handled via SelectNetwork component

## Common Commands

### Development

```bash
# Start all dev servers (web + others)
yarn dev

# Start only the web dev server
yarn dev:web

# Install dependencies and build everything
yarn setup
```

### Building

```bash
# Build all packages (includes typechain generation for SDK)
yarn build

# Build only the SDK
yarn build:sdk

# Build only the web app
yarn build:web

# Build contracts
yarn build:contracts
```

### Code Quality

```bash
# Format all code with Prettier
yarn format

# Type-check all TypeScript
yarn typecheck

# Note: No ESLint in this project - formatting is handled by Prettier
```

### Smart Contracts (packages/contracts/)

```bash
cd packages/contracts

# Build contracts
forge build

# Run tests
forge test

# Test with gas reporting
forge test --gas-report

# Generate coverage report
forge coverage

# Deploy contracts (requires .env with PRIVATE_KEY)
yarn deploy

# Dry run deployment
yarn deploy:dry

# Export ABIs for SDK
yarn export:abis

# Format Solidity code
forge fmt
```

### SDK (packages/sdk/)

```bash
cd packages/sdk

# Generate TypeChain types from ABIs (REQUIRED before build)
yarn typechain

# Build SDK
yarn build

# Clean build artifacts
yarn clean
```

### Subgraph (packages/subgraph/)

```bash
cd packages/subgraph

# Build for specific network
yarn build:ethereum
yarn build:arbitrum-one
yarn build:base
yarn build:gnosis

# Deploy to specific network
yarn deploy:ethereum
yarn deploy:arbitrum-one
yarn deploy:base
yarn deploy:gnosis

# Note: Each build:network script runs prepare:network (generates config) + codegen before building
```

### Web (packages/web/)

```bash
cd packages/web

# Run dev server
yarn dev

# Type-check
yarn typecheck

# Format
yarn format

# Clean build artifacts
yarn clean
```

## Key Implementation Details

### Adding New Chain Support

To support a new blockchain network:

1. **Update SDK** (`packages/sdk/src/vaults/constants.ts`):
   - Add TradeFoundry address to `TRADE_FOUNDRY_ADDRESS_LIST`
   - Add DCAFarm singleton to `DCAFARM_SINGLETON_ADDRESS_LIST`
   - Add CoW settlement address to `COW_SETTLEMENT_ADDRESS_LIST`
   - Add subgraph endpoint to `SUBGRAPH_ENDPOINT_LIST`
   - Run `yarn typechain && yarn build`

2. **Update Subgraph** (`packages/subgraph/`):
   - Add network config in `bin/build-subgraph.ts`
   - Add prepare and deploy scripts to `package.json`

3. **Update Web** (`packages/web/`):
   - Add chain to Wagmi config (`providers/wagmi-config.ts`)
   - Update token lists and default pairs in `models/` or `utils/`
   - Update token picker constants

### React Context Usage

Always wrap Context values in `useMemo()` to prevent unnecessary re-renders, especially for contexts wrapping the entire app. See examples in `packages/web/contexts/`.

### TypeChain Dependency

The SDK build depends on TypeChain-generated types from contract ABIs. **Always run `yarn typechain` in `packages/sdk/` before building the SDK or web app.** The root `yarn build` script handles this automatically.

### Known Issues

- **Unhandled Runtime Error**: Export client components as arrow functions (not regular functions) for Next.js 13.2.4+
- **Extra server attributes warning**: Disable browser extensions (Grammarly, LanguageTool) for dev ports
- **Circular dependency errors**: Check import cycles, especially in `packages/web/components/index.ts`
- **Missing generated contracts**: Run `rm -rf node_modules && yarn install && yarn build:web && yarn dev`

## Testing

### Contracts
```bash
cd packages/contracts
forge test
```

### Web/SDK
Currently no automated tests configured for web and SDK packages.

## Development Environment

- **Node.js**: 22+ (specified in package.json), 20+ minimum
- **Package Manager**: Yarn 4.9.2 (set in packageManager field)
- **Git Submodules**: This repo uses submodules - clone with `--recurse-submodules` or run `git submodule update --init --recursive`
- **Foundry**: Required for contracts package
- **TypeScript**: Version 5.1.3 (web), 4.7.4 (sdk)

## Environment Variables

### Contracts (`.env` in packages/contracts/)
- `PRIVATE_KEY`: Deployer private key
- `ETHEREUM_RPC_URL`, `ARBITRUM_RPC_URL`, `BASE_RPC_URL`, `GNOSIS_RPC_URL`, `POLYGON_RPC_URL`, `AVALANCHE_RPC_URL`: RPC endpoints
- `ETHERSCAN_API_KEY_V2`: For contract verification

### Subgraph
- `DEPLOY_KEY`: The Graph deploy key (for `yarn auth`)

### SDK/Web (optional overrides)
- `OLIVE_ALCHEMY_PROJECT_ID`: Satsuma/Alchemy subgraph project ID (defaults provided)
- `OLIVE_THEGRAPH_API_KEY`: The Graph API key (defaults provided)
- Network-specific subgraph URLs can be overridden with env vars like `ETHEREUM_SUBGRAPH_API_URL`

## Deployment

- Web app deploys via Netlify (see `netlify.toml` config)
- Contracts deploy with `forge script` via `packages/contracts/scripts/Deploy.s.sol`
- Subgraphs deploy to The Graph Network per chain using `graph deploy`
