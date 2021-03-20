import fs from 'fs';
import path from 'path';
import { customWalletFactory } from './customWalletFactory';

export const generate = async (args: any) => {
  const { password, debug } = args;
  const wallet = customWalletFactory.build({ contents: [] });
  const seed = await wallet.passwordToKey(password);
  const contents = await wallet.generateContentFromSeed(seed);
  contents.forEach((c: any) => {
    wallet.add(c);
  });
  const exported = await wallet.export(password);
  if (debug) {
    console.info(
      'writing encrypted wallet to dist: \n',
      JSON.stringify(exported, null, 2)
    );
  }
  fs.writeFileSync(
    path.resolve(process.cwd(), './wallet.json'),
    JSON.stringify(exported, null, 2)
  );
};

export const unlock = async (args: any) => {
  const { password, debug } = args;
  const walletFile = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), './wallet.json')).toString()
  );
  const wallet = await customWalletFactory.build().import(walletFile, password);
  if (debug) {
    console.info('decrypted wallet: \n', JSON.stringify(wallet, null, 2));
  }
  fs.writeFileSync(
    path.resolve(process.cwd(), './unlocked-wallet.json'),
    JSON.stringify(wallet, null, 2)
  );
};
