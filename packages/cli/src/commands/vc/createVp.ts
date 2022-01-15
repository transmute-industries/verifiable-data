import { documentLoader } from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

import faker from 'faker';

export const createVp = async (presentation: any, key: any) => {
  const result = await verifiable.presentation.create({
    presentation: presentation,
    format: [
      'vp',
      // 'vc-jwt'
    ],
    domain: 'ontology.example',
    challenge: faker.random.alphaNumeric(8),
    documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key),
    }),
  });
  return result.items[0];
};
