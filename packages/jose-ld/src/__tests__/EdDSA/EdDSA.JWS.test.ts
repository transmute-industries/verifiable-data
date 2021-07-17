import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
import { JWS } from '../../index';

let k: Ed25519KeyPair;
const JWA_ALG = 'EdDSA';

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

it('sign / verify', async () => {
  const signer = JWS.createSigner(k.signer(), JWA_ALG);
  const verifier = JWS.createVerifier(k.verifier(), JWA_ALG);
  const message = { message: 'hello' };
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({
    signature,
  });
  expect(verified).toBe(true);
});

it('sign / verify - larger example', async () => {
  const credential: any = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'http://example.edu/credentials/3732',
    type: ['VerifiableCredential'],
    issuer: 'https://example.edu/issuers/14',
    issuanceDate: '2010-01-01T19:23:24Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
  };
  const payload: any = {
    iss:
      typeof credential.issuer === 'string'
        ? credential.issuer
        : credential.issuer.id,
    sub:
      typeof credential.credentialSubject === 'string'
        ? credential.credentialSubject
        : credential.credentialSubject.id,
    vc: credential,
    jti: credential.id,
    nbf: 1262373804,
  };
  const signer = JWS.createSigner(k.signer(), JWA_ALG, {
    header: {
      kid: '123',
    },
  });
  const verifier = JWS.createVerifier(k.verifier(), JWA_ALG);
  const signature = await signer.sign({ data: payload });
  const verified = await verifier.verify({
    signature,
  });
  expect(verified).toBe(true);
});
