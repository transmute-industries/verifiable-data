import * as x25519 from '@stablelib/x25519';
import {
  LdKeyPairStatic,
  LdKeyPairInstance,
  staticImplements,
} from '@transmute/ld-key-pair';

import { getMultibaseFingerprintFromPublicKeyBytes } from './getMultibaseFingerprintFromPublicKeyBytes';

import { JsonWebKey2020, X25519KeyAgreementKey2019 } from './types';

import { importableTypes } from './importFrom';
import { exportableTypes } from './exportAs';
import { base58 } from './encoding';
import {
  X25519_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from './constants';

@staticImplements<LdKeyPairStatic>()
export class X25519KeyPair implements LdKeyPairInstance {
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

  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    const buffer = base58.decode(fingerprint.substring(1));

    if (
      buffer[0] === X25519_MULTICODEC_IDENTIFIER &&
      buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
    ) {
      let kp = await X25519KeyPair.from({
        id: '',
        controller: '',
        type: 'X25519KeyAgreementKey2019',
        publicKeyBase58: base58.encode(buffer.slice(2)),
      });
      const f = await kp.fingerprint();
      kp.id = `did:key:${f}#${f}`;
      kp.controller = `did:key:${f}`;
      return kp;
    }
    throw new Error('Unsupported fingerprint type: ' + fingerprint);
  }
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

  async export(
    options: {
      privateKey?: boolean;
      type: 'JsonWebKey2020' | 'X25519KeyAgreementKey2019';
    } = {
      privateKey: false,
      type: 'JsonWebKey2020',
    }
  ): Promise<JsonWebKey2020 | X25519KeyAgreementKey2019> {
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
}
