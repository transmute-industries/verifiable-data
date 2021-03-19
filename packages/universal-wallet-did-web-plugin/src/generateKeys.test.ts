import { generateKeys } from './generateKeys';

it('can generate ed25519', async () => {
  const [k0] = await generateKeys('ed25519');
  expect(k0.type).toBe('Ed25519VerificationKey2018');
});

it('can generate x25519', async () => {
  const [k0] = await generateKeys('x25519');
  expect(k0.type).toBe('X25519KeyAgreementKey2019');
});

it('can generate bls12381', async () => {
  const [k0, k1] = await generateKeys('bls12381');
  expect(k0.type).toBe('Bls12381G1Key2020');
  expect(k1.type).toBe('Bls12381G2Key2020');
});

it('can generate p-256', async () => {
  const [k0] = await generateKeys('p-256');
  expect(k0.type).toBe('JsonWebKey2020');
});

it('can generate secp256k1', async () => {
  const [k0] = await generateKeys('secp256k1');
  expect(k0.type).toBe('EcdsaSecp256k1VerificationKey2019');
});
