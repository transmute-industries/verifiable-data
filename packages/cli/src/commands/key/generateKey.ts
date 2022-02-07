import crypto from 'crypto';

import { DidKey } from '../../types';

export interface GenerateKeyOptions {
  type?: string;
  seed?: string; // hex encoded buffer
  accept?: 'application/did+json' | 'application/did+ld+json';
}

const didKey = require('@transmute/did-key.js');

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
