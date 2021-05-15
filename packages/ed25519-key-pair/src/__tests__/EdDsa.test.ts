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
