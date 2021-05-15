import * as bls from 'noble-bls12-381';

import {
  generateBls12381G1KeyPair,
  generateBls12381G2KeyPair,
  blsSign,
  blsVerify,
} from '@mattrglobal/node-bbs-signatures';

const seed = '5bcf19514e0b48f0dba948b5b37e102d80a7ce994b4f5b5f0adf19959c434cd4';
const privateKey =
  '26ebbeb0602f2696667cb206c1716f4d9e6a8ef8b883fe05ff2dfabff078ad91';
const message = 'hello';
const messages = [Uint8Array.from(Buffer.from(message))];

it('deterministic key gen', async () => {
  const k1 = await generateBls12381G1KeyPair(
    Uint8Array.from(Buffer.from(seed, 'hex'))
  );
  const k2 = await generateBls12381G2KeyPair(
    Uint8Array.from(Buffer.from(seed, 'hex'))
  );
  expect(Buffer.from(k1.secretKey).toString('hex')).toBe(privateKey);
  expect(Buffer.from(k2.secretKey).toString('hex')).toBe(privateKey);
  // noble public keys are in G1!
  expect(Buffer.from(k1.publicKey).toString('hex')).toBe(
    Buffer.from(bls.getPublicKey(k1.secretKey)).toString('hex')
  );
});

it('noble (g1): bls sign and verify', async () => {
  const k = await generateBls12381G1KeyPair(
    Uint8Array.from(Buffer.from(seed, 'hex'))
  );
  const sk = k.secretKey;
  const pk = k.publicKey;
  const m = Buffer.from(message).toString('hex');
  const s = await bls.sign(m, sk);
  const verified = await bls.verify(s, m, pk);
  expect(verified).toBe(true);
});

it('mattr (g2): bls sign and verify', async () => {
  const k = await generateBls12381G2KeyPair(
    Uint8Array.from(Buffer.from(seed, 'hex'))
  );
  const s = await blsSign({
    keyPair: k,
    messages,
  });
  const { verified } = await blsVerify({
    signature: s,
    messages,
    publicKey: k.publicKey,
  });
  expect(verified).toBe(true);
});
