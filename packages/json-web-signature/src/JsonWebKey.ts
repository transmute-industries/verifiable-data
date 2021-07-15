import {
  X25519KeyPair,
  X25519KeyAgreementKey2019,
} from '@transmute/x25519-key-pair';
import {
  Ed25519KeyPair,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-key-pair';
import {
  Secp256k1KeyPair,
  EcdsaSecp256k1VerificationKey2019,
} from '@transmute/secp256k1-key-pair';
import { Bls12381G2KeyPair } from '@transmute/bls12381-key-pair';

import crypto from 'crypto';
import { JWS } from '@transmute/jose-ld';

import {
  WebCryptoKey,
  JsonWebKey2020,
  P256Key2021,
  P384Key2021,
  P521Key2021,
} from '@transmute/web-crypto-key-pair';

const getKeyPairForKtyAndCrv = (kty: string, crv: string) => {
  if (kty === 'OKP') {
    if (crv === 'Ed25519') {
      return Ed25519KeyPair;
    }
    if (crv === 'X25519') {
      return X25519KeyPair;
    }
  }
  if (kty === 'EC') {
    if (crv === 'secp256k1') {
      return Secp256k1KeyPair;
    }

    if (crv === 'BLS12381_G2') {
      return Bls12381G2KeyPair;
    }

    if (['P-256', 'P-384', 'P-521'].includes(crv)) {
      return WebCryptoKey;
    }
  }
  throw new Error(`getKeyPairForKtyAndCrv does not support: ${kty} and ${crv}`);
};

const getKeyPairForType = (k: any) => {
  if (k.type === 'JsonWebKey2020') {
    return getKeyPairForKtyAndCrv(k.publicKeyJwk.kty, k.publicKeyJwk.crv);
  }
  if (k.type === 'Ed25519VerificationKey2018') {
    return Ed25519KeyPair;
  }
  if (k.type === 'X25519KeyAgreementKey2019') {
    return X25519KeyPair;
  }
  if (k.type === 'EcdsaSecp256k1VerificationKey2019') {
    return Secp256k1KeyPair;
  }
  if (k.type === 'Bls12381G2Key2020') {
    return Bls12381G2KeyPair;
  }

  if (['P256Key2021', 'P384Key2021', 'P521Key2021'].includes(k.type)) {
    return WebCryptoKey;
  }

  throw new Error('getKeyPairForType does not support type: ' + k.type);
};

const getVerifier = async (k: any) => {
  const { publicKeyJwk } = await k.export({ type: 'JsonWebKey2020' });
  const { kty, crv } = publicKeyJwk;
  console.log(k);
  if (kty === 'OKP') {
    if (crv === 'Ed25519') {
      return JWS.createVerifier(k.verifier('EdDsa'), 'EdDSA', {
        detached: true,
      });
    }
    if (crv === 'X25519') {
      return JWS.createVerifier(
        k.verifier('ECDH-ES+A256KW'),
        'ECDH-ES+A256KW',
        {
          detached: true,
        }
      );
    }
  }

  if (kty === 'EC') {
    if (crv === 'secp256k1') {
      return JWS.createVerifier(k.verifier('Ecdsa'), 'ES256K', {
        detached: true,
      });
    }

    if (crv === 'P-256') {
      return JWS.createVerifier(k.verifier('Ecdsa'), 'ES256', {
        detached: true,
      });
    }
    if (crv === 'P-384') {
      return JWS.createVerifier(k.verifier('Ecdsa'), 'ES384', {
        detached: true,
      });
    }
    if (crv === 'P-521') {
      return JWS.createVerifier(k.verifier('Ecdsa'), 'ES512', {
        detached: true,
      });
    }

    if (crv === 'BLS12381_G2') {
      throw new Error('BLS12381_G2 has no registered JWA');
    }
  }

  throw new Error(
    `getVerifier does not suppport ${JSON.stringify(publicKeyJwk, null, 2)}`
  );
};

const getSigner = async (k: any) => {
  const { publicKeyJwk } = await k.export({ type: 'JsonWebKey2020' });
  const { kty, crv } = publicKeyJwk;
  if (kty === 'OKP') {
    if (crv === 'Ed25519') {
      return JWS.createSigner(k.signer('EdDsa'), 'EdDSA', {
        detached: true,
      });
    }
    if (crv === 'X25519') {
      return JWS.createSigner(k.signer('ECDH-ES+A256KW'), 'ECDH-ES+A256KW', {
        detached: true,
      });
    }
  }
  if (kty === 'EC') {
    if (crv === 'secp256k1') {
      return JWS.createSigner(k.signer('Ecdsa'), 'ES256K', {
        detached: true,
      });
    }
    if (crv === 'BLS12381_G2') {
      throw new Error('BLS12381_G2 has no registered JWA');
    }
    if (crv === 'P-256') {
      return JWS.createSigner(k.signer('Ecdsa'), 'ES256', {
        detached: true,
      });
    }
    if (crv === 'P-384') {
      return JWS.createSigner(k.signer('Ecdsa'), 'ES384', {
        detached: true,
      });
    }
    if (crv === 'P-521') {
      return JWS.createSigner(k.signer('Ecdsa'), 'ES512', {
        detached: true,
      });
    }
  }
  throw new Error(
    `getSigner does not suppport ${JSON.stringify(publicKeyJwk, null, 2)}`
  );
};

const useJwa = async (k: any) => {
  const verifier = await getVerifier(k);
  k.verifier = () => verifier as any;
  if (k.privateKey) {
    const signer = await getSigner(k);
    k.signer = () => signer as any;
  }
  return k;
};

export class JsonWebKey {
  public id!: string;
  public type!: string;
  public controller!: string;

  public signer!: () => any;
  public verifier!: () => any;

  static generate = async (options: any = { kty: 'OKP', crv: 'Ed25519' }) => {
    const KeyPair = getKeyPairForKtyAndCrv(options.kty, options.crv);
    const kp = await KeyPair.generate({
      kty: options.kty,
      crvOrSize: options.crv,
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    return useJwa(kp);
  };

  static from = async (
    k:
      | JsonWebKey2020
      | P256Key2021
      | P384Key2021
      | P521Key2021
      | Ed25519VerificationKey2018
      | EcdsaSecp256k1VerificationKey2019
      | X25519KeyAgreementKey2019
  ) => {
    const KeyPair = getKeyPairForType(k);
    const kp = await KeyPair.from(k as any);
    return useJwa(kp);
  };
}
