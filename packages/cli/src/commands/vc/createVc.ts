import { documentLoader } from '../../util';

import { verifiable } from '@transmute/vc.js';
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';

export const createVc = async (credential: any, key: any) => {
  const result = await verifiable.credential.create({
    credential: credential,
    format: [
      'vc',
      // 'vc-jwt'
    ],
    documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key),
    }),
  });
  return result.items[0];
};
