import { walletFactory } from '../walletFactory';
import { getFastifyWithWalletOptions } from './getFastifyWithWalletOptions';
import { documentLoader } from '../__fixtures__/documentLoader';

let wallets: any = {};

// normally this would be a get or create operation
// that probably already happened
const getAccountEncryptedWallet = async (accountId: string) => {
  const wallet = walletFactory.build();
  const seed = await wallet.passwordToKey(accountId);
  const contents = await wallet.generateContentFromSeed(seed);
  const did = wallet.convertEndpointToDid(
    'https://platform.example/accounts/123/did.json'
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
  const encryptedWallet = await wallet.export('elephant');
  return encryptedWallet;
};

const getAccountEncryptedWalletPassword = (_accountId: string) => {
  return 'elephant';
};

export const get = async (accountId: string) => {
  if (wallets[accountId]) {
    return wallets[accountId];
  }
  const wallet = walletFactory.build();
  const accountEncryptedWallet = await getAccountEncryptedWallet(accountId);
  const password = await getAccountEncryptedWalletPassword(accountId);
  return wallet.import(accountEncryptedWallet, password);
};

const set = async (accountId: string, wallet: any) => {
  wallets[accountId] = wallet;
};

export const walletOptions = {
  walletId: 'accountId',
  origin: 'https://platform.example',
  discovery: ['did:web'],
  apis: [
    // vc-http-api
    'issuer',
    'holder',
    'verifier',
    // universal wallet
    'add',
    'remove',
    'contents',
  ],
  get,
  set,
  documentLoader,
};

export { getFastifyWithWalletOptions };
