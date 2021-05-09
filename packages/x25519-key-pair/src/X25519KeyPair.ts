import * as x25519 from '@stablelib/x25519';
import { getMultibaseFingerprintFromPublicKeyBytes } from './getMultibaseFingerprintFromPublicKeyBytes';

import { JsonWebKey2020, X25519KeyAgreementKey2019 } from './types';

import { importableTypes } from './importFrom';
import { exportableTypes } from './exportAs';

export class X25519KeyPair {
  public id: string;
  public type: string = 'JsonWebKey2020';
  public controller: string;
  public publicKey: Uint8Array;
  public privateKey?: Uint8Array;

  static async fingerprintFromPublicKey(importableType: JsonWebKey2020) {
    const { publicKey } = await X25519KeyPair.from(importableType);
    return getMultibaseFingerprintFromPublicKeyBytes(publicKey);
  }

  static generate = async ({
    secureRandom,
  }: {
    secureRandom: () => Uint8Array;
  }) => {
    const key = x25519.generateKeyPair({
      isAvailable: true,
      randomBytes: secureRandom,
    });

    const fingerprint = getMultibaseFingerprintFromPublicKeyBytes(
      key.publicKey
    );

    const controller = `did:key:${fingerprint}`;
    const id = `${controller}#${fingerprint}`;

    return new X25519KeyPair({
      id: id,
      type: 'JsonWebKey2020',
      controller: controller,
      publicKey: key.publicKey,
      privateKey: key.secretKey,
    });
  };

  static from = async (k: JsonWebKey2020 | X25519KeyAgreementKey2019) => {
    const { publicKey, privateKey } = importableTypes[k.type](k as any);
    return new X25519KeyPair({
      id: k.id,
      type: k.type,
      controller: k.controller,
      publicKey,
      privateKey,
    });
  };

  constructor(opts: {
    id: string;
    type: string;
    controller: string;
    publicKey: Uint8Array;
    privateKey?: Uint8Array;
  }) {
    this.id = opts.id;
    this.type = opts.type || 'JsonWebKey2020';
    this.controller = opts.controller;
    this.publicKey = opts.publicKey;
    this.privateKey = opts.privateKey;
  }

  async fingerprint() {
    return getMultibaseFingerprintFromPublicKeyBytes(this.publicKey);
  }

  export(
    options: {
      privateKey?: boolean;
      type: 'JsonWebKey2020' | 'X25519KeyAgreementKey2019';
    } = {
      privateKey: false,
      type: 'JsonWebKey2020',
    }
  ): JsonWebKey2020 | X25519KeyAgreementKey2019 {
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

  async deriveSecret({
    publicKey,
  }: {
    publicKey: JsonWebKey2020 | X25519KeyAgreementKey2019;
  }) {
    const remote = await X25519KeyPair.from(publicKey);
    if (!this.privateKey) {
      throw new Error('No private key available for deriveSecret');
    }
    const scalarMultipleResult = x25519.sharedKey(
      this.privateKey,
      remote.publicKey,
      true
    );
    return scalarMultipleResult;
  }

  async toJsonWebKeyPair(exportPrivateKey = false) {
    console.warn(
      "DEPRECATION WARNING: .toJsonWebKeyPair should be replaced with .export({type:'JsonWebKey2020'})."
    );
    return exportableTypes['JsonWebKey2020'](
      this.id,
      this.controller,
      this.publicKey,
      exportPrivateKey ? this.privateKey : undefined
    );
  }
}