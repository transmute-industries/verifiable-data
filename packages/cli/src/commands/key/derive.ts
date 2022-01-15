import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';

import { generateKey } from '../key/generate';
const fs = require('fs');
const path = require('path');

export const deriveKey = async (
  type: string,
  mnemonic: string,
  hdpath: string
) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const addrNode = root.derive(hdpath);
  return await generateKey({
    type: type,
    seed: addrNode._privateKey,
  });
};

export const deriveKeyFromMnemonicCommand = [
  'key derive [type] [mnemonic] [hdpath]',
  'Generate key pair',
  (yargs: any) => {
    yargs.positional('type', {
      choices: [...['ed25519', 'x25519', 'secp256k1', 'bls12381']],
      default: 'ed25519',
      describe: 'The type of key to derive.',
    });
    yargs.positional('mnemonic', {
      type: 'string',
      describe: 'The mnemonic used to derive the key.',
    });
    yargs.positional('hdpath', {
      type: 'string',
      default: `m/44'/0'/0'/0`,
      describe: 'The hd path used to derive the key.',
    });
  },
  async (argv: any) => {
    const keys = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
    if (argv.debug) {
      console.log('derived keys', keys);
    } else {
      fs.writeFileSync(
        path.resolve(process.cwd(), './keys.json'),
        JSON.stringify({ keys }, null, 2)
      );
    }
  },
];
