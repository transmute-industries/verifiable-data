import { walletFactory } from '../walletFactory';

const password = 'elephant';

it('generate / export / import ', async () => {
  const wallet = walletFactory.build();
  const { didDocument, keys } = await wallet.generate(
    'https://platform.example/accounts/123/did.json'
  );
  wallet.add(didDocument);
  keys.forEach((k: any) => {
    wallet.add(k);
  });

  const exported = await wallet.export(password);
  exported.id = keys[0].controller + '#encrypted-wallet';
  exported.issuer = keys[0].controller;
  exported.credentialSubject.id = keys[0].controller;
  expect(exported.credentialSubject.encryptedWalletContents).toBeDefined();

  const wallet2 = await walletFactory.build().import(exported, password);
  expect(wallet2.contents).toEqual(wallet.contents);
});
