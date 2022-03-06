import {
  documentLoader,
  getKeyFromFile,
  getPresentationFromFile,
  handleCommandResponse,
} from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import faker from 'faker';

import { deriveKey } from '../key';
import * as api from '../../vc-api';

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

export const createPresentationHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let key;
  let presentation = getPresentationFromFile(argv.input);
  let data: any = {};
  if (!argv.endpoint) {
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
    data = await createPresentation(
      presentation,
      key,
      argv.format,
      argv.domain,
      argv.challenge
    );
  } else {
    const opts: any = {
      endpoint: argv.endpoint,
      presentation,
      options: {},
    };
    if (argv.access_token) {
      opts.access_token = argv.access_token;
    }
    if (argv.domain) {
      opts.options.domain = argv.domain;
    }
    if (argv.challenge) {
      opts.options.challenge = argv.challenge;
    }
    data = await api.prove(opts);
  }
  handleCommandResponse(argv, data, argv.output);
};
