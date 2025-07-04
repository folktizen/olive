# 🚀 Olive

[![Netlify Status](https://api.netlify.com/api/v1/badges/c5a9a0d6-d16e-4936-9eea-d310629a179d/deploy-status)](https://app.netlify.com/projects/useolive/deploys)

Olive is a Next.js monorepo project that implements Dollar Cost Averaging using the CoW Protocol.

---

## ⚡️ Prerequisites

Before you can run this project, make sure you have the following software installed:

- [Node.js 22+](https://nodejs.org/) 🟢
- [Yarn](https://yarnpkg.com/) 🧶
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
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

   The dev server will start at [http://localhost:3000](http://localhost:3000) 🌐

---

## 🔍 Subgraph

> **Note:** The files `bin/build-subgraph.ts` and `bin/config.ts` referenced in previous instructions do not exist. Please refer to the scripts in `packages/subgraph/package.json` for subgraph build and deployment steps.

- To deploy the Subgraph, use the appropriate `build:<network>` and `deploy:<network>` scripts in `packages/subgraph/package.json`.

  ```bash
  cd packages/subgraph
  yarn build:ethereum
  yarn deploy:ethereum
  ```

---

## 🚀 Deployment

To deploy Olive to production:

```bash
yarn build
```

---

## 🌍 Supporting New Chains

1. **Update the SDK:**
   - Add smart contract addresses for the target chain:
     - Olive TradeFoundry
     - Olive DCAFarm singleton
     - Olive TheGraph subgraph endpoint
     - CoW Protocol's settlement address
   - Update `packages/sdk/src/vaults/constants.ts`
   - Run:
     ```bash
     cd packages/sdk
     yarn typechain
     yarn build
     ```
2. **Update the Subgraph:**
   - Edit the relevant config and network support in `packages/subgraph` scripts and config files.
3. **Update the UI web:**
   - Add tokens and default pairs in the appropriate files under `packages/web/models/`, `packages/web/utils/`, or related directories as your project structure requires.
   - Update WAGMI chains config and token picker constants in their respective files.
4. **Try to create a new farm in the UI!**

---

## 🧑‍💻 Code Guidelines

### 🟦 React Contexts

React Context checks values using simple equality (`==`).

> **Tip:** Always use the `useMemo()` hook for custom Contexts to avoid unnecessary re-renders, especially when wrapping the whole app.

- Example files: `packages/web/context/`
- More info: [React Context Docs](https://react.dev/learn/passing-data-deeply-with-context)

---

## 🛠️ Troubleshooting

- **Unhandled Runtime Error (Next.js):**

  - On Next.js v13.2.4+, exporting a client component with a normal function can cause this. Use an arrow function instead.

- **Warning: Extra attributes from the server:**

  - Caused by browser extensions (e.g., Grammarly, LanguageTool) injecting attributes. Disable/configure extensions for dev ports (like `3000`).

- **Cannot read properties of undefined (reading Component):**

  - Likely due to circular dependencies. Check for import cycles and adjust exports (see `packages/web/components/index.ts`).

- **Error fetching `generated/contracts`:**
  - App build failure. Try:
    ```bash
    rm -rf node_modules
    yarn install
    yarn build:web
    yarn dev
    ```

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork this repo 🍴
2. Create a new branch for your changes 🌱
3. Make your changes and ensure your code passes formatting and typechecking:

   ```bash
   yarn format
   yarn typecheck
   ```

4. Submit a pull request 🚀

---

## 📄 License

Olive is released into the public domain under the [MIT](LICENSE). Enjoy! 🎉

---

## 🧹 Formatting & Linting

- **Formatting:**
  - Run `yarn format` in the root or any package to format code using Prettier.
  - Each package can have its own `.prettierignore` for custom ignore rules.
  - Prettier config is shared via `@useolive/config`.
- **Linting:**
  - ESLint is not used in this monorepo. All linting is handled by Prettier formatting rules.
  - If you need linting, add ESLint config to the relevant package.

---
