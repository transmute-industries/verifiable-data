import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';

let k: Ed25519KeyPair;
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
  const signer = k.signer();
  const verifier = k.verifier();
  const message = Uint8Array.from(Buffer.from('hello'));
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({
    signature,
    data: message,
  });
  expect(verified).toBe(true);
});
