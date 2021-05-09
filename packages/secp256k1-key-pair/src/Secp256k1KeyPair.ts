import secp256k1 from 'secp256k1';

import {
  JsonWebKey2020,
  EcdsaSecp256k1VerificationKey2020,
  EcdsaSecp256k1VerificationKey2019,
} from './types';
import { getMultibaseFingerprintFromPublicKeyBytes } from './getMultibaseFingerprintFromPublicKeyBytes';

import { importableTypes } from './importFrom';
import { exportableTypes } from './exportAs';

import { suiteTypes } from './suites';

const _generate = async (secureRandom: () => Uint8Array) => {
  let privateKey;
  do {
    privateKey = secureRandom();
  } while (!secp256k1.privateKeyVerify(privateKey));

  const publicKey = secp256k1.publicKeyCreate(privateKey);
  return { publicKey, privateKey: new Uint8Array(privateKey) };
};

export class Secp256k1KeyPair {
  public id: string;
  public type: string = 'JsonWebKey2020';
  public controller: string;
  public publicKey: Uint8Array;
  public privateKey?: Uint8Array;

  static generate = async ({
    secureRandom,
  }: {
    secureRandom: () => Uint8Array;
  }) => {
    const { publicKey, privateKey } = await _generate(secureRandom);
    const fingerprint = getMultibaseFingerprintFromPublicKeyBytes(publicKey);
    const controller = `did:key:${fingerprint}`;
    const id = `${controller}#${fingerprint}`;

    return new Secp256k1KeyPair({
      id: id,
      type: 'JsonWebKey2020',
      controller: controller,
      publicKey,
      privateKey,
    });
  };

  static from = async (
    k:
      | JsonWebKey2020
      | EcdsaSecp256k1VerificationKey2019
      | EcdsaSecp256k1VerificationKey2020
  ) => {
    const { publicKey, privateKey } = importableTypes[k.type](k as any);
    return new Secp256k1KeyPair({
      id: k.id,
      type: k.type,
      controller: k.controller,
      publicKey,
      privateKey,
    });
  };

  static async fingerprintFromPublicKey(
    importableType: JsonWebKey2020 | EcdsaSecp256k1VerificationKey2019
  ) {
    const { publicKey } = await Secp256k1KeyPair.from(importableType);
    return getMultibaseFingerprintFromPublicKeyBytes(publicKey);
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

  signer(type: 'Ecdsa' | 'EcRecover' | 'Schnorr' = 'Ecdsa') {
    if (!this.privateKey) {
      throw new Error('No private key to sign with.');
    }
    if (suiteTypes[type]) {
      return suiteTypes[type].signer(this.privateKey);
    }
    throw new Error('Unsupported suite type ' + type);
  }
  verifier(type: 'Ecdsa' | 'EcRecover' | 'Schnorr' = 'Ecdsa') {
    if (!this.publicKey) {
      throw new Error('No public key to verify with.');
    }
    if (suiteTypes[type]) {
      return suiteTypes[type].verifier(this.publicKey);
    }
    throw new Error('Unsupported suite type ' + type);
  }

  async deriveSecret({
    publicKey,
  }: {
    publicKey:
      | JsonWebKey2020
      | EcdsaSecp256k1VerificationKey2019
      | EcdsaSecp256k1VerificationKey2020;
  }) {
    const remote = await Secp256k1KeyPair.from(publicKey);
    return secp256k1.ecdh(remote.publicKey, this.privateKey);
  }

  export(
    options: {
      privateKey?: boolean;
      type:
        | 'JsonWebKey2020'
        | 'EcdsaSecp256k1VerificationKey2020'
        | 'EcdsaSecp256k1VerificationKey2019';
    } = {
      privateKey: false,
      type: 'JsonWebKey2020',
    }
  ):
    | JsonWebKey2020
    | EcdsaSecp256k1VerificationKey2020
    | EcdsaSecp256k1VerificationKey2019 {
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
    return exportableTypes['JsonWebKey2020'](
      this.id,
      this.controller,
      this.publicKey,
      exportPrivateKey ? this.privateKey : undefined
    );
  }
}
