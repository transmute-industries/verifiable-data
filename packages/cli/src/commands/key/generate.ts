import crypto from 'crypto';
import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';

import { DidKey } from '../../types';

import { handleCommandResponse } from '../../util';

export interface GenerateKeyOptions {
  type?: string;
  seed?: string; // hex encoded buffer
  accept?: 'application/did+json' | 'application/did+ld+json';
}

const didKey = require('@transmute/did-key.js');

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

export const generateKey = async (
  opts: GenerateKeyOptions
): Promise<DidKey[]> => {
  const type = opts.type || 'Ed25519';
  const accept = opts.accept || 'application/did+json';
  const secureRandom = () => {
    const seed = opts.seed
      ? Buffer.from(opts.seed, 'hex')
      : crypto.randomBytes(32);
    return seed;
  };
  const { keys } = await didKey.generate(type, { secureRandom }, { accept });
  return keys;
};

export const generateKeyHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let data;
  if (argv.seed) {
    data = await generateKey({
      type: argv.type,
      seed: argv.seed,
    });
  }
  if (argv.mnemonic) {
    data = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
  }
  handleCommandResponse(argv, data);
};
