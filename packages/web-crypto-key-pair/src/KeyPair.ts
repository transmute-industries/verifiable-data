import * as key from './key';
import {
  deriveBitsFromJsonWebKey2020,
  deriveBitsFromCryptoKey,
} from './derive-bits';
import { getDetachedJwsSigner, getDetachedJwsVerifier } from './signatures/jws';
import { GenerateKeyOpts, JsonWebKey2020, KeyPairOptions } from './types';

import { getMulticodec, getKid } from './key/identifiers';
import { getJwkFromCryptoKey } from './key';

export class KeyPair {
  public id: string;
  public type: string = 'JsonWebKey2020';
  public controller: string;
  public publicKey: CryptoKey;
  public privateKey?: CryptoKey;

  static generate = async (
    opts: GenerateKeyOpts = { kty: 'EC', crvOrSize: 'P-384' }
  ) => {
    const kp = await key.generate(opts);
    const id = await getMulticodec(kp.publicKeyJwk);
    const {
      publicKey,
      privateKey,
    } = await key.getCryptoKeyPairFromJsonWebKey2020(kp);
    return new KeyPair({
      id: `#${await KeyPair.fingerprintFromPublicKey(kp.publicKeyJwk)}`,
      type: 'JsonWebKey2020',
      controller: `did:key:${id}`,
      publicKey,
      privateKey,
    });
  };

  static from = async (k: JsonWebKey2020) => {
    const {
      publicKey,
      privateKey,
    } = await key.getCryptoKeyPairFromJsonWebKey2020(k);
    return new KeyPair({
      id: k.id,
      type: 'JsonWebKey2020',
      controller: k.controller,
      publicKey,
      privateKey,
    });
  };

  static async fingerprintFromPublicKey(publicKeyJwk: any) {
    return getKid(publicKeyJwk);
  }

  constructor(opts: KeyPairOptions) {
    this.id = opts.id;
    this.type = opts.type || 'JsonWebKey2020';
    this.controller = opts.controller;
    this.publicKey = opts.publicKey;
    this.privateKey = opts.privateKey;
  }

  async fingerprint() {
    return getKid(await getJwkFromCryptoKey(this.publicKey));
  }

  async toJsonWebKeyPair(exportPrivateKey = false) {
    const kp: JsonWebKey2020 = {
      id: this.id,
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyJwk: await key.getJwkFromCryptoKey(this.publicKey),
    };
    if (exportPrivateKey) {
      try {
        kp.privateKeyJwk = await key.getJwkFromCryptoKey(
          this.privateKey as CryptoKey
        );
      } catch (e) {
        throw new Error('Cannot export private key');
      }
    }
    return kp;
  }

  async deriveBits(remote: JsonWebKey2020) {
    if (this.privateKey?.extractable) {
      return deriveBitsFromJsonWebKey2020(
        await this.toJsonWebKeyPair(true),
        remote
      );
    } else {
      const publicKey = await key.getCryptoKeyFromJsonWebKey2020(remote, true);
      return deriveBitsFromCryptoKey(this.privateKey as CryptoKey, publicKey);
    }
  }
  signer() {
    if (this.privateKey) {
      return getDetachedJwsSigner(this.privateKey);
    }
    throw new Error('No private key to sign with.');
  }
  verifier() {
    if (this.publicKey) {
      return getDetachedJwsVerifier(this.publicKey);
    }
    throw new Error('No public key to verify with.');
  }
}
