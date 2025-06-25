# Shared config for Prettier and ESLint in Olive monorepo

This package contains the shared configuration for Prettier and ESLint. All packages and the root extend these configs for consistent formatting and linting.

## Usage

In each package and the root, use:

- `prettier.config.js`:
  ```js
  module.exports = require("../../config/prettier.config");
  ```
- `eslint.config.js`:
  ```js
  module.exports = require("../../config/eslint.config");
  ```

## Prettier rules
- Double quotes (no single quotes)
- Indentation: 2 spaces
- Trailing commas: all
- Bracket spacing: true
- Arrow parens: always
- End of line: LF

## ESLint
- Extends recommended, TypeScript, React, and Prettier
- Prettier rules enforced via plugin

Update this config to change formatting/linting for the whole monorepo.
