# Verifiable Data

![CI](https://github.com/transmute-industries/verifiable-data/workflows/CI/badge.svg) ![CD](https://github.com/transmute-industries/verifiable-data/workflows/CD/badge.svg)

### Node Verion

Due to WASM compatibility issues, this repo is currently limited to node 14 and npm v6.

```
npm i npm@6.14.16 -g
```

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
- [universal wallet](#universal-wallett)
  - [base wallet](./packages/universal-wallet)
  - [did key plugin](./packages/universal-wallet-did-key-plugin)
  - [did web plugin](./packages/universal-wallet-did-web-plugin)
  - [verifiable credentials plugin](./packages/universal-wallet-vc-plugin)
  - [encrypted data vaults plugin](./packages/universal-wallet-edv-plugin)
  - [google secrets plugin](./packages/universal-wallet-google-secrets)
  - [fastify vc http api plugin](./packages/universal-wallet-fastify-plugin)
- [command line interface](./packages/cli)
- [hashlink](./packages/hl)
- [compressable bitstring](./packages/compressable-bitstring)
- [did-web](./packages/did-web)
- [jsonld schema](./packages/jsonld-schema)
- [browser smoke test](https://transmute-industries.github.io/verifiable-data/smoke-test-react/)

## Development

Requires node 14.
