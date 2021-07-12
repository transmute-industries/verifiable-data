import { ld as vc } from '@transmute/vc.js';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';

import { checkStatus } from '../..';

import { case14, case15, documentLoader } from './__fixtures__';

it('case 14 should pass', async () => {
  const result = await vc.verifyCredential({
    credential: case14,
    documentLoader,
    suite: [new Ed25519Signature2018()],
    checkStatus, // required
  });
  expect(result.verified).toBe(true);
});

it('case 15 should fail', async () => {
  const result = await vc.verifyCredential({
    credential: case15,
    documentLoader,
    suite: [new Ed25519Signature2018()],
    checkStatus, // required
  });
  expect(result.verified).toBe(false);
});
