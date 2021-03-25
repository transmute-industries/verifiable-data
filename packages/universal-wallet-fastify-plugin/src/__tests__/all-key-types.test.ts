import { walletFactory } from '../walletFactory';

import { case0 } from '../__fixtures__/wallets';

const password = 'elephant';

it('can generate wallet with all key types', async () => {
  const wallet = walletFactory.build();
  const { verificationMethods } = await wallet.generate(
    'https://platform.example/accounts/123/did.json'
  );
  const keys = Object.values(verificationMethods);
  keys.forEach((k: any) => {
    wallet.add(k);
  });
  const exported = await wallet.export(password);
  exported.id = keys[0].controller + '#encrypted-wallet';
  exported.issuer = keys[0].controller;
  exported.credentialSubject.id = keys[0].controller;
  expect(exported.credentialSubject.encryptedWalletContents).toBeDefined();
});

it('can import wallet with all key types', async () => {
  const wallet = await walletFactory.build().import(case0, password);
  expect(wallet.contents.length).toBe(6);
});
