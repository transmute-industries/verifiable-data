import crypto from 'crypto';
import didKey from '@transmute/did-key.js';
import { DidKey } from '../../types';

const fs = require('fs');
const path = require('path');

export interface GenerateKeyOptions {
  type?: string;
  seed?: string; // hex encoded buffer
  accept?: 'application/did+json' | 'application/did+ld+json';
}

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

export const generateKeyCommand = [
  'key generate [type] [seed]',
  'Generate key pair',
  (yargs: any) => {
    yargs.positional('type', {
      choices: [
        ...['ed25519', 'x25519', 'secp256k1', 'bls12381'],
        ...['secp256r1', 'secp384r1', 'secp521r1'],
      ],
      default: 'ed25519',
      describe: 'The type of key to generate.',
    });
    yargs.positional('seed', {
      type: 'string',
      describe:
        'The seed used to generate the key. ' +
        ['secp256r1', 'secp384r1', 'secp521r1'].join(', ') +
        'do not support this option.',
    });
  },
  async (argv: any) => {
    const keys = await generateKey({
      type: argv.type,
      seed: argv.seed,
    });
    if (argv.debug) {
      console.log('generated keys', keys);
    } else {
      fs.writeFileSync(
        path.resolve(process.cwd(), './keys.json'),
        JSON.stringify({ keys }, null, 2)
      );
    }
  },
];
