import {
  LdKeyPairStatic,
  LdKeyPairInstance,
  staticImplements,
} from '@transmute/ld-key-pair';

import * as key from './key';
import {
  deriveBitsFromJsonWebKey2020,
  deriveBitsFromCryptoKey,
} from './derive-bits';
import { getDetachedJwsSigner, getDetachedJwsVerifier } from './signatures/jws';
import {
  GenerateKeyOpts,
  JsonWebKey2020,
  KeyPairOptions,
  P256Key2021,
  P384Key2021,
  P521Key2021,
} from './types';

import { getMulticodec, getJwkFromMulticodec } from './key/identifiers';
import { getJwkFromCryptoKey } from './key';
import { exportableTypes } from './exportAs';

@staticImplements<LdKeyPairStatic>()
export class KeyPair implements LdKeyPairInstance {
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
    return getMulticodec(publicKeyJwk);
  }

  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    try {
      const publicKeyJwk = getJwkFromMulticodec(fingerprint);

      return KeyPair.from({
        id: `did:key:${fingerprint}#${fingerprint}`,
        type: 'JsonWebKey2020',
        controller: `did:key:${fingerprint}`,
        publicKeyJwk,
      });
    } catch (e) {
      throw new Error('Unsupported fingerprint type: ' + fingerprint);
    }
  }

  constructor(opts: KeyPairOptions) {
    this.id = opts.id;
    this.type = opts.type || 'JsonWebKey2020';
    this.controller = opts.controller;
    this.publicKey = opts.publicKey;
    this.privateKey = opts.privateKey;
  }

  async fingerprint() {
    return getMulticodec(await getJwkFromCryptoKey(this.publicKey));
  }

  async export(
    options: {
      privateKey?: boolean;
      type: 'JsonWebKey2020' | 'P521Key2021' | 'P384Key2021' | 'P256Key2021';
    } = {
      privateKey: false,
      type: 'JsonWebKey2020',
    }
  ): Promise<JsonWebKey2020 | P521Key2021 | P384Key2021 | P256Key2021> {
    if (exportableTypes[options.type]) {
      return exportableTypes[options.type](
        this.id,
        this.controller,
        this.publicKey,
        options.privateKey ? this.privateKey : undefined
      );
    }
    throw new Error('Unsupported export options: ' + JSON.stringify(options));
  }

  async toJsonWebKeyPair(exportPrivateKey = false) {
    console.warn(
      "DEPRECATION WARNING: .toJsonWebKeyPair should be replaced with .export({type:'JsonWebKey2020'})."
    );
    return this.export({
      type: 'JsonWebKey2020',
      privateKey: exportPrivateKey,
    }) as Promise<JsonWebKey2020>;
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
