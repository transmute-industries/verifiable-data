import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
import { JWS } from '../../index';

let k: Ed25519KeyPair;
const [rawSuiteType, JWA_ALG]: any = ['EdDsa', 'EdDSA'];

beforeAll(async () => {
  k = await Ed25519KeyPair.generate({
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

it('detached sign / verify', async () => {
  const signer = JWS.createSigner(k.signer(rawSuiteType), JWA_ALG, {
    detached: true,
  });
  const verifier = JWS.createVerifier(k.verifier(), JWA_ALG, {
    detached: true,
  });
  const message = Uint8Array.from(Buffer.from('hello'));
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({
    data: message,
    signature,
  });
  expect(verified).toBe(true);
});
