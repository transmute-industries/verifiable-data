import {
  documentLoader,
  getCredentialFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import { deriveKey } from '../key/derive';

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

export const createCredentialHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let key;
  let credential = getCredentialFromFile(argv.input);
  let data: any = {};
  if (!argv.endpoint) {
    if (argv.key) {
      key = getKeyFromFile(argv.key);
    }
    if (argv.mnemonic) {
      const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
      key = keys[0];
    }
    if (credential.issuer.id) {
      credential.issuer.id = key.controller;
    } else {
      credential.issuer = key.controller;
    }
    data = await createCredential(credential, key, argv.format);
  } else {
    const opts: any = {
      endpoint: argv.endpoint,
      credential,
      options: { type: 'Ed25519Signature2018' },
    };
    if (argv.access_token) {
      opts.access_token = argv.access_token;
    }
    data = await api.issue(opts);
  }

  handleCommandResponse(argv, data, argv.output);
};
