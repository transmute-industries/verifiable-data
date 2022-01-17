import {
  documentLoader,
  getKeyFromFile,
  getPresentationFromFile,
  handleCommandResponse,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import faker from 'faker';

import { deriveKey } from '../key/derive';

export const createPresentation = async (
  presentation: any,
  key: any,
  format: any,
  domain = 'ontology.example',
  challenge = faker.random.alphaNumeric(8)
) => {
  const result = await verifiable.presentation.create({
    presentation: presentation,
    format: [format],
    domain,
    challenge,
    documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key),
    }),
  });
  return result.items[0];
};

export const createPresentationCommand = [
  'presentation create',
  'Create a verifiable presentation',
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
    domain: {
      alias: 'd',
      type: 'string',
      description: 'Domain of the verifier',
    },
    challenge: {
      alias: 'c',
      type: 'string',
      description: 'Challenge from the verifier',
    },
    format: {
      alias: 'f',
      choices: ['vp', 'vp-jwt'],
      description: 'Output format',
      default: 'vp',
    },
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let key;
    let presentation = getPresentationFromFile(argv.input);
    if (argv.key) {
      key = getKeyFromFile(argv.key);
    }
    if (argv.mnemonic) {
      const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
      key = keys[0];
    }
    if (presentation.holder.id) {
      presentation.holder.id = key.controller;
    } else {
      presentation.holder = key.controller;
    }
    const data = await createPresentation(
      presentation,
      key,
      argv.format,
      argv.domain,
      argv.challenge
    );
    handleCommandResponse(argv, data, argv.output);
  },
];
