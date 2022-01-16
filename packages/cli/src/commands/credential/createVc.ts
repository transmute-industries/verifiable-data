import {
  documentLoader,
  getCredentialFromFile,
  getKeyFromFile,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import { deriveKey } from '../key/derive';

const fs = require('fs');
const path = require('path');

export const createVc = async (credential: any, key: any, format: any) => {
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

export const createCredentialCommand = [
  'credential create',
  'Create a verifiable credential',
  {
    input: {
      alias: 'i',
      description: 'Path to input document',
      demandOption: true,
    },
    output: {
      alias: 'o',
      description: 'Path to output document',
      demandOption: true,
    },
    // key or mnemonic + hdpath + type is required
    key: {
      alias: 'k',
      description: 'Path to key',
    },
    mnemonic: {
      alias: 'm',
      description: 'Mnemonic to derive key',
    },
    hdpath: {
      alias: 'hd',
      description: 'HD Path to derive key',
    },
    type: {
      alias: 't',
      description: 'Type of key to derive',
    },
    format: {
      alias: 'f',
      choices: ['vc', 'vc-jwt'],
      description: 'Output format',
      default: 'vc',
    },
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let key;
    let credential = getCredentialFromFile(argv.input);
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
    const data = await createVc(credential, key, argv.format);
    if (argv.debug) {
      console.log('issued credential', data);
    } else {
      fs.writeFileSync(
        path.resolve(process.cwd(), argv.output),
        JSON.stringify({ data }, null, 2)
      );
    }
  },
];
