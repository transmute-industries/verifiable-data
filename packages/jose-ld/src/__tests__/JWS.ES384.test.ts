import { WebCryptoKey } from '@transmute/web-crypto-key-pair';
import { JWS } from '../index';

let k: WebCryptoKey;
beforeAll(async () => {
  k = await WebCryptoKey.generate();
});

const rawSuiteType = 'Ecdsa';
const JWA_ALG = 'ES384';

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
