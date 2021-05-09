import { Secp256k1KeyPair } from '../index';

let k: Secp256k1KeyPair;
beforeAll(async () => {
  k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
          'hex'
        )
      );
    },
  });
});

it('sign and verify', async () => {
  const signer = k.signer('Schnorr');
  const verifier = k.verifier('Schnorr');
  const message = Buffer.from('hello');
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});

it('verify fails when signature changes', async () => {
  const signer = k.signer('Schnorr');
  const verifier = k.verifier('Schnorr');
  const message = Buffer.from('hello');
  const signature = await signer.sign({ data: message });
  signature[0] = 42;
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(false);
});
