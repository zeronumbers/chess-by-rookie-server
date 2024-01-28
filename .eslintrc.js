module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "implicit-arrow-linebreak": "off",
    // disable because prettier decides this
    "operator-linebreak": "off",
    // disable indent https://github.com/typescript-eslint/typescript-eslint/issues/1824
    "@typescript-eslint/indent": "off",
  },
};
