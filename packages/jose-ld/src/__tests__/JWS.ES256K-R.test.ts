import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';
import { JWS } from '../index';

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

const rawSuiteType = 'EcRecover';
const JWA_ALG = 'ES256K-R';

describe(`${rawSuiteType} as ${JWA_ALG}`, () => {
  it('sign / verify', async () => {
    const signer = JWS.createSigner(k.signer(rawSuiteType), JWA_ALG);
    const verifier = JWS.createVerifier(k.verifier(rawSuiteType), JWA_ALG);
    const message = Uint8Array.from(Buffer.from('hello'));
    const signature = await signer.sign({ data: message });
    const verified = await verifier.verify({
      signature,
    });
    expect(verified).toBe(true);
  });
  it('detached sign / verify', async () => {
    const signer = JWS.createSigner(k.signer(rawSuiteType), JWA_ALG, {
      detached: true,
    });
    const verifier = JWS.createVerifier(k.verifier(rawSuiteType), JWA_ALG, {
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
});
