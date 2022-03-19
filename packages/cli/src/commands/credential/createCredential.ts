import {
  documentLoader,
  getCredentialFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import { deriveKey } from '../key';

import * as did from '../did';
import * as api from '../../vc-api';

export const createCredential = async (
  credential: any,
  key: any,
  format: any = 'vc'
) => {
  const result = await verifiable.credential.create({
    credential: credential,
    format: [format],
    documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key),
    }),
  });
  return result.items[0];
};

export const createPublicRegistryCredential = async (
  argv: any,
  key: any,
  credential: any
) => {
  const didDoc = await did.createDocument({
    username: argv.username,
    repository: argv.repository,
    mnemonic: argv.mnemonic,
    hdpath: argv.hdpath,
    type: argv.type,
  });
  key.id = didDoc.id + '#' + key.id.split('#').pop();
  key.controller = didDoc.id;
  const hostedCredentialPath = argv.output.split('/').pop();
  credential.id = `https://${argv.username}.github.io/${argv.repository}/credentials/${hostedCredentialPath}`;
  return createCredential(credential, key, argv.format);
};

export type IssuanceMethod =
  | 'from-path-to-json-web-key'
  | 'from-json-web-key'
  | 'from-vc-api'
  | 'from-mnemonic';

export const argvToIssuanceMethod = (argv: any): IssuanceMethod => {
  if (argv.key) {
    try {
      JSON.parse(argv.key);
      return 'from-json-web-key';
    } catch (e) {
      return 'from-path-to-json-web-key';
    }
  }
  if (argv.endpoint) {
    return 'from-vc-api';
  }
  if (argv.mnemonic) {
    return 'from-mnemonic';
  }
  throw new Error('Cannot determine issuance method');
};

export const getKey = async (argv: any) => {
  let key: any = null;
  const issuanceMethod = argvToIssuanceMethod(argv);
  if (issuanceMethod === 'from-json-web-key') {
    key = JSON.parse(argv.key);
  }
  if (issuanceMethod === 'from-path-to-json-web-key') {
    key = getKeyFromFile(argv.key);
  }
  if (issuanceMethod === 'from-mnemonic') {
    const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
    key = keys[0];
  }
  return key;
};

export const issueWithVcApi = (argv: any, credential: any) => {
  const opts: any = {
    endpoint: argv.endpoint,
    credential,
    options: { type: 'Ed25519Signature2018' },
  };
  if (argv.access_token) {
    opts.access_token = argv.access_token;
  }
  return api.issue(opts);
};

export const createCredentialHandler = async (argv: any) => {
  let data: any = {};
  if (argv.debug) {
    console.log(argv);
  }
  let credential = getCredentialFromFile(argv.input);
  const key = await getKey(argv);
  if (key === null) {
    // must be vc-api
    data = await issueWithVcApi(argv, credential);
  } else {
    if (credential.issuer.id) {
      credential.issuer.id = key.controller;
    } else {
      credential.issuer = key.controller;
    }
    if (argv.username && argv.repository) {
      data = await createPublicRegistryCredential(argv, key, credential);
    } else {
      data = await createCredential(credential, key, argv.format);
    }
  }
  handleCommandResponse(argv, data, argv.output);
};
