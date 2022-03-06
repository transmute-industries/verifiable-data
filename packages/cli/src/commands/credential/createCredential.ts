import path from 'path';
import {
  documentLoader,
  getCredentialFromFile,
  getKeyFromFile,
  handleCommandResponse,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import { deriveKey } from '../key';

import * as api from '../../vc-api';

import * as did from '../did';

import uuid from 'uuid';

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

    if (argv.username && argv.repository) {
      const didDoc = await did.createDocument({
        username: argv.username,
        repository: argv.repository,
        mnemonic: argv.mnemonic,
        hdpath: argv.hdpath,
        type: argv.type,
      });
      if (credential.issuer.id) {
        credential.issuer.id = didDoc.id;
      } else {
        credential.issuer = didDoc.id;
      }
      key.id = didDoc.id + '#' + key.id.split('#').pop();
      key.controller = didDoc.id;
      const fileName = `${uuid.v4()}.json`;
      credential.id = `https://${argv.username}.github.io/${argv.repository}/credentials/${fileName}`;
      argv.output = path.join(argv.output, fileName);
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
