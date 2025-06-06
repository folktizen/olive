# 🚀 Olive

Olive is a Next.js + Cloudflare monorepo project that implements Dollar Cost Averaging using the CoW Protocol.

---

## ⚡️ Prerequisites

Before you can run this project, make sure you have the following software installed:

- [Node.js 18+](https://nodejs.org/) 🟢
- [Bun](https://bun.sh/) 🍞
- [Git](https://git-scm.com/) 🐙

---

## 🏁 Getting Started

1. **Clone the repository with submodules:**

   ```bash
   git clone --recurse-submodules https://github.com/folktizen/olive.git
   ```

   > If you already cloned without `--recurse-submodules`, run:
   >
   > ```bash
   > git submodule update --init --recursive
   > ```

2. **Install the dependencies:**

   ```bash
   cd olive
   bun install
   bun build:dev
   ```

3. **Start the development server:**

   ```bash
   bun dev
   ```

   The dev server will start at [http://localhost:3000](http://localhost:3000) 🌐

---

## 🔍 Subgraph

To update the `subgraph.yaml`, go to `bin/build-subgraph.ts` and update the subgraph JSON. This script runs before deployment to create a new `subgraph.yaml`.

- Make sure `bin/config.ts` is updated for the latest contract `address` and `startBlock`.
- To deploy the Subgraph:

  ```bash
  bun build
  bun deploy
  ```

---

## 🚀 Deployment

To deploy Olive to production:

```bash
bun build
```

This creates a production build in the `dist` directory. Deploy the contents of this directory to your server or hosting provider.

---

## 🌍 Supporting New Chains

1. **Update the SDK:**
   - Add smart contract addresses for the target chain:
     - Olive OrderFactory
     - Olive DCAOrder singleton
     - Olive TheGraph subgraph endpoint
     - CoW Protocol's settlement address
   - Update `packages/sdk/src/vaults/constants.ts`
   - Run:
     ```bash
     cd packages/sdk
     bun typechain
     bun build
     ```
2. **Update the Subgraph:**
   - Edit `packages/subgraph/bin/config.ts` with the Factory contract `address` and `startBlock`
   - Update `SUPPORTED_NETWORKS` in `packages/subgraph/bin/build-subgraph.ts`
   - Add relevant `build` and `prepare` commands in `packages/subgraph/package.json`
3. **Update the UI app:**
   - Add tokens for the new chain in `packages/app/models/token/tokens.ts`
   - Add a default token pair in `packages/app/utils/constants.ts`
   - Update WAGMI chains config in `packages/app/providers/wagmi-config.ts`
   - Add common tokens in `packages/app/components/token-picker/constants.ts`
4. **Try to create a new farm in the UI!**

---

## 🧑‍💻 Code Guidelines

### 🟦 React Contexts

React Context checks values using simple equality (`==`).

> **Tip:** Always use the `useMemo()` hook for custom Contexts to avoid unnecessary re-renders, especially when wrapping the whole app.

- Example files: `packages/app/context/`
- More info: [React Context Docs](https://react.dev/learn/passing-data-deeply-with-context)

---

## 🛠️ Troubleshooting

- **Unhandled Runtime Error (Next.js):**

  - On Next.js v13.2.4+, exporting a client component with a normal function can cause this. Use an arrow function instead.

- **Warning: Extra attributes from the server:**

  - Caused by browser extensions (e.g., Grammarly, LanguageTool) injecting attributes. Disable/configure extensions for dev ports (like `3000`).

- **Cannot read properties of undefined (reading Component):**

  - Likely due to circular dependencies. Check for import cycles and adjust exports (see `packages/app/components/index.ts`).

- **Error fetching `generated/contracts`:**
  - App build failure. Try:
    ```bash
    rm -rf node_modules
    bun install
    bun build:app
    bun dev
    ```

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork this repo 🍴
2. Create a new branch for your changes 🌱
3. Make your changes and ensure your code passes formatting and typechecking:

   ```bash
   bun format
   bun typecheck
   ```

4. Submit a pull request 🚀

---

## 📄 License

Olive is released into the public domain under the [MIT](LICENSE). Enjoy! 🎉

---

## 🧹 Formatting & Linting

- **Formatting:**
  - Run `bun format` in the root or any package to format code using Prettier.
  - Each package can have its own `.prettierignore` for custom ignore rules.
  - Prettier config is shared via `@useolive/config`.
- **Linting:**
  - ESLint is not used in this monorepo. All linting is handled by Prettier formatting rules.
  - If you need linting, add ESLint config to the relevant package.

---
