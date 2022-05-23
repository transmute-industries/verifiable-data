# Verifiable Data

![CI](https://github.com/transmute-industries/verifiable-data/workflows/CI/badge.svg) ![CD](https://github.com/transmute-industries/verifiable-data/workflows/CD/badge.svg)

### What is Verifiable Data?

Verifiable Data is the library that powers [W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/) & [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) for [Transmute](https://github.com/transmute-industries).

## Table of Contents

- [contexts](#contexts)
  - [credentials](./packages/credentials-context)
  - [did](./packages/did-context)
  - [security](./packages/security-context)
  - [revocation list](./packages/revocation-list-context)
- [proof keys](#keys)
  - [web crypto](./packages/web-crypto-key-pair)
- [proof suites](#suites)
  - [ed25519 2018](./packages/ed25519-signature-2018)
  - [jws 2020](./packages/json-web-signature)
- [credential suites](#credential-suites)
  - [revocation list 2020](./packages/vc-status-rl-2020)
- [command line interface](./packages/cli)
- [hashlink](./packages/hl)
- [compressable bitstring](./packages/compressable-bitstring)
- [did-web](./packages/did-web)
- [jsonld schema](./packages/jsonld-schema)
- [browser smoke test](https://transmute-industries.github.io/verifiable-data/smoke-test-react/)

## Development

Node Version

```
nvm install 14
nvm use 14
npm i npm@6.14.16 -g
```

Install build and run tests for all packages

```
git clone https://github.com/transmute-industries/verifiable-data.git
cd verifiable-data
npm i
npm t
```

## Lerna Information

It is important for developers working in this repo to understand that `lerna` is used to manage and link off the package contained. For more information regarding what `lerna` is and why it's used, click [here](https://github.com/lerna/lerna).

### Common Lerna Commands

Below is a short list of the lerna commands you will encounter while working in this repo, along with some information on when they should be used.

1. `lerna bootstrap`: This command is used to build and link all of the packages in the repo. This command takes a significant amount of time to complete and should be used very conservatively. In your typical development workflow, you should only run this once when starting on a task or after running `npm install` inside one of the packages.

2. `lerna link`: This command is used to symlink all of the packages. This command is what you will want to run when working in a package, and you want all of the other packages to include the latest changes. This means you should be using this command very frequently.

IMPORTANT: It is vital when running these commands, that you do not ever exit the commands early. If you do exit early, your environment will become completely broken. Should this happen, you can always get to a fresh working state by running `npm run install:clean`. This command will clean out all of your packages, and then rebuild everything with `lerna bootstrap`.

## License

[Apache-2.0](./LICENSE) © Transmute Industries Inc.
