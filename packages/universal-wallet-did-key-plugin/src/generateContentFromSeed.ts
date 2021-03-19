import * as ed25519 from '@transmute/did-key-ed25519';

import crypto from 'isomorphic-webcrypto';

export const seedToId = async (seed: Uint8Array) => {
  const buffer = await crypto.subtle.digest('SHA-256', seed);
  return `urn:digest:${Buffer.from(new Uint8Array(buffer)).toString('hex')}`;
};

const generateContentFromSeed = async (seed: Uint8Array) => {
  const ed25519KeyPair = await ed25519.Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(seed);
    },
  });

  const k0 = ed25519KeyPair.toJsonWebKeyPair(true);
  const k1 = ed25519KeyPair.toX25519KeyPair(true).toJsonWebKeyPair(true);
  const signingKey = k0;
  const encryptionKey = k1;

  const seedId = await seedToId(seed);

  const secret0 = {
    '@context': ['http://w3id.org/wallet/v1'],
    id: seedId,
    name: 'DID Key Secret',
    image: 'https://via.placeholder.com/150',
    description: 'Used to generate a DID with a signing and encryption key.',
    tags: ['inception'],
    type: 'Entropy',
    value: Buffer.from(seed).toString('hex'),
  };

  const key0 = {
    ...signingKey,
    id: signingKey.controller + signingKey.id,
    '@context': ['http://w3id.org/wallet/v1'],
    name: 'Signing Key',
    image: 'https://via.placeholder.com/150',
    description: 'Used to produce digital signatures.',
    tags: ['inception'],
    generatedFrom: [secret0.id],
  };

  const key1 = {
    ...encryptionKey,
    id: encryptionKey.controller + encryptionKey.id,
    '@context': ['http://w3id.org/wallet/v1'],
    name: 'Encryption Key',
    image: 'https://via.placeholder.com/150',
    description: 'Used to derive symmetric keys for encryption.',
    tags: ['inception'],
    generatedFrom: [secret0.id],
  };

  const contents = [secret0, key0, key1];
  return contents;
};

export { generateContentFromSeed };
