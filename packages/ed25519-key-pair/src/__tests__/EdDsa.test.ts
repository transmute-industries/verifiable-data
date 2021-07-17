import { Ed25519KeyPair } from '../index';

let k: Ed25519KeyPair;

beforeAll(async () => {
  k = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
          'hex'
        )
      );
    },
  });
});

it('sign / verify', async () => {
  const signer = k.signer();
  const verifier = k.verifier();
  const message = Buffer.from('hello');
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});

it('verify fails when signature changes', async () => {
  const signer = k.signer();
  const verifier = k.verifier();
  const message = Buffer.from('hello');
  const signature = await signer.sign({ data: message });
  signature[0] = 42;
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(false);
});

it('sign / verify - larger example', async () => {
  const signer = k.signer();
  const verifier = k.verifier();
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
  const message = Buffer.from(JSON.stringify(payload));
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});
