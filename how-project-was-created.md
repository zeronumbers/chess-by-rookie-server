# How project was created

## create new project

```
npm init
```

## install typescript

```
npm install --save-dev typescript
```

## eslint

```
npm init @eslint/config
```
- How would you like to use ESLint?
  problems
- What type of modules does your project use?
  esm
- Which framework does your project use?
  none
- Does your project use TypeScript?
  Yes
- Where does your code run? (note u have to use space to select!)
  Node
- What format do you want your config file to be in?
  JavaScript
- The config that you've selected requires the following dependencies:
  @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
  Would you like to install them now?
  Yes
- use npm to install packages

## install airbnb-base

```
npx install-peerdeps --dev eslint-config-airbnb-base
```

##  edit .eslintrc.cjs

```
  extends: [
    "airbnb-base",
```

## install typescript support for airbnb

```
npm install --save-dev eslint-config-airbnb-typescript
```

## edit .eslintrc.cjs

```
extends: [
  'airbnb-base',
+ 'airbnb-typescript/base'
]
```

```
+ parserOptions: {
+   project: './tsconfig.json'
+ }
```


## create tsconfig.json

```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "baseUrl": "./",
    "paths": {
      "*": [
        "./src/*"
      ]
    },
    "outDir": "./dist",
    "forceConsistentCasingInFileNames": true,
    "strict": true
  },
  "include": [
    ".eslintrc.cjs",
    "src"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## add rules to .eslintrc.cjs

```js
rules: {
    'implicit-arrow-linebreak': 'off',
    // disable because prettier decides this
    'operator-linebreak': 'off',
    // disable indent https://github.com/typescript-eslint/typescript-eslint/issues/1824
    '@typescript-eslint/indent': 'off',
  },
```


## prettier

### install

```
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

### create .prettierrc.cjs

contents:
```
module.exports = {
  trailingComma: "all", // all instead of es5 because of typescript
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};
```
