import crypto from 'crypto';
import * as ed25519 from '@transmute/did-key-ed25519';
import * as x25519 from '@transmute/did-key-x25519';
import * as secp256k1 from '@transmute/did-key-secp256k1';
import * as bls12381 from '@transmute/did-key-bls12381';
import * as didKeyWeb from '@transmute/did-key-web-crypto';

export const generateKeys = async (type: string): Promise<any[]> => {
  const options = {
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  switch (type) {
    case 'ed25519': {
      return [await ed25519.Ed25519KeyPair.generate(options)];
    }
    case 'x25519': {
      return [await x25519.X25519KeyPair.generate(options)];
    }
    case 'bls12381': {
      const keypairs = await bls12381.Bls12381KeyPairs.generate();
      return [keypairs.g1KeyPair, keypairs.g2KeyPair];
    }
    case 'p-256': {
      return [
        await didKeyWeb.KeyPair.generate({
          kty: 'EC',
          crvOrSize: 'P-256',
        }),
      ];
    }
    case 'secp256k1': {
      return [await secp256k1.Secp256k1KeyPair.generate(options)];
    }
  }
  throw new Error('Unsupported key type ' + type);
};

// const k0 = await KeyPair.generate();
