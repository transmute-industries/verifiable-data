import {
  LdKeyPairStatic,
  LdKeyPairInstance,
  staticImplements,
} from '@transmute/ld-key-pair';

import * as key from './key';
import { deriveBitsFromCryptoKey } from './derive-bits';
import { getSigner, getVerifier } from './signatures/raw';
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
export class WebCryptoKey implements LdKeyPairInstance {
  public id: string;
  public type: string = 'JsonWebKey2020';
  public controller: string;
  public publicKey: CryptoKey;
  public privateKey?: CryptoKey;

  static generate = async (
    opts: GenerateKeyOpts = { kty: 'EC', crvOrSize: 'P-384' }
  ) => {
    const kp = await key.generate(opts);
    const id = await WebCryptoKey.fingerprintFromPublicKey({
      id: ``,
      type: 'JsonWebKey2020',
      controller: ``,
      publicKeyJwk: kp.publicKeyJwk,
    });
    const {
      publicKey,
      privateKey,
    } = await key.getCryptoKeyPairFromJsonWebKey2020(kp);
    return new WebCryptoKey({
      id: `did:key:${id}#${id}`,
      type: 'JsonWebKey2020',
      controller: `did:key:${id}`,
      publicKey,
      privateKey,
    });
  };

  static from = async (
    k: JsonWebKey2020 | P256Key2021 | P384Key2021 | P521Key2021
  ) => {
    if (k.type === 'JsonWebKey2020') {
      const {
        publicKey,
        privateKey,
      } = await key.getCryptoKeyPairFromJsonWebKey2020(k);
      return new WebCryptoKey({
        id: k.id,
        type: 'JsonWebKey2020',
        controller: k.controller,
        publicKey,
        privateKey,
      });
    }
    const {
      publicKey,
      privateKey,
    } = await key.getCryptoKeyPairFromMultiKey2021(k);
    return new WebCryptoKey({
      id: k.id,
      type: k.type,
      controller: k.controller,
      publicKey,
      privateKey,
    });
  };

  static async fingerprintFromPublicKey(
    publicKey: JsonWebKey2020 | P256Key2021 | P384Key2021 | P521Key2021
  ) {
    const k = await WebCryptoKey.from(publicKey);
    return (await k).fingerprint();
  }

  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    try {
      const publicKeyJwk = getJwkFromMulticodec(fingerprint);

      return WebCryptoKey.from({
        id: `did:key:${fingerprint}#${fingerprint}`,
        type: 'JsonWebKey2020',
        controller: `did:key:${fingerprint}`,
        publicKeyJwk,
      });
    } catch (e) {
      // console.warn(e);
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

  signer(type: 'Ecdsa' = 'Ecdsa') {
    if (this.privateKey) {
      return getSigner(this.privateKey);
    }
    throw new Error(`No private key to sign ${type} with.`);
  }
  verifier(type: 'Ecdsa' = 'Ecdsa') {
    if (this.publicKey) {
      return getVerifier(this.publicKey);
    }
    throw new Error(`No public key to verify ${type} with.`);
  }

  async deriveSecret({
    publicKey,
  }: {
    publicKey: JsonWebKey2020 | P256Key2021 | P384Key2021 | P521Key2021;
  }) {
    if (!this.privateKey) {
      throw new Error('private key is required to deriveSecret');
    }
    let localPrivateKey = this.privateKey;
    // This is required by web crypto to set the key type.
    // so that deriveBits may be called.
    if (this.privateKey?.extractable) {
      localPrivateKey = (
        await key.getCryptoKeyPairFromJsonWebKey2020(
          (await this.export({
            type: 'JsonWebKey2020',
            privateKey: true,
          })) as JsonWebKey2020,
          true
        )
      ).privateKey as CryptoKey;
    }
    const remotePublicKey =
      publicKey.type === 'JsonWebKey2020'
        ? await key.getCryptoKeyPairFromJsonWebKey2020(publicKey, true)
        : await key.getCryptoKeyPairFromMultiKey2021(publicKey, true);

    return deriveBitsFromCryptoKey(localPrivateKey, remotePublicKey.publicKey);
  }
}
