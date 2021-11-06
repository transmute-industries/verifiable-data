import * as panva from '../../JWS/__fixtures__/panva-helper';
import * as transmute from '../../JWS/__fixtures__/transmute-helper';

import didResolution from './did-resolution.json';
import { compact } from './jwt.json';

it('secp256k1', async () => {
  const { publicKeyJwk } = didResolution.didDocument.verificationMethod[0];

  const verified = await panva.verify(compact, publicKeyJwk);
  expect(verified).toBe(true);

  const verified2 = await transmute.verify(compact, publicKeyJwk);
  expect(verified2).toBe(true);
});
