import { walletFactory } from '../walletFactory';

let wallets: any = {};

const getAccountEncryptedWallet = async (accountId: string) => {
  if (wallets[accountId]) {
    return wallets[accountId];
  }
  const wallet = walletFactory.build();
  const seed = await wallet.passwordToKey(accountId);
  const contents = await wallet.generateContentFromSeed(seed);
  const did = wallet.convertEndpointToDid(
    `https://platform.example/accounts/${accountId}/did.json`
  );
  const keys = contents
    .filter((k: any) => {
      return k.type === 'JsonWebKey2020';
    })
    .map((k: any, i: number) => {
      let k1 = JSON.parse(JSON.stringify(k));
      k1.id = `${did}#key-${i}`;
      k1.controller = did;
      return {
        id: k1.id,
        type: k1.type,
        controller: k1.controller,
        publicKeyJwk: k1.publicKeyJwk,
        privateKeyJwk: k1.privateKeyJwk,
      };
    });
  keys.forEach((c: any) => {
    wallet.add(c);
  });
  const encryptedWallet = await wallet.export(accountId);
  wallets[accountId] = encryptedWallet;
  return encryptedWallet;
};

const getAccountEncryptedWalletPassword = (_accountId: string) => {
  return _accountId;
};

const get = async (accountId: string) => {
  const wallet = walletFactory.build();
  const accountEncryptedWallet = await getAccountEncryptedWallet(accountId);
  const password = await getAccountEncryptedWalletPassword(accountId);
  return wallet.import(accountEncryptedWallet, password);
};

const set = async (accountId: string, wallet: any) => {
  const encryptedWallet = await wallet.export(accountId);
  wallets[accountId] = encryptedWallet;
};

const walletOptions = {
  walletId: 'accountId',
  origin: 'https://platform.example',
  discovery: ['did:web'],
  apis: ['issuer', 'holder', 'verifier'],
  documentLoader: {
    allowNetwork: true,
  },
  get,
  set,
};

export { walletOptions };
