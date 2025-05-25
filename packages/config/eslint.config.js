// Shared ESLint flat config for Olive monorepo
const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  // TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@typescript-eslint": ts },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },
  // React support
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: { react },
    languageOptions: {
      ecmaFeatures: { jsx: true },
    },
    rules: {
      ...react.configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
  // Prettier integration
  prettier,
  // Custom rules
  {
    rules: {
      "prettier/prettier": ["error", require("./prettier.config")],
    },
  },
];
