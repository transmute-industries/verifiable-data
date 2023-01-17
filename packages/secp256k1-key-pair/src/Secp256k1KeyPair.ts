import secp256k1 from 'secp256k1';

import {
  LdKeyPairStatic,
  LdKeyPairInstance,
  staticImplements,
} from '@transmute/ld-key-pair';

import { base58 } from './encoding';

import {
  SECP256K1_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from './constants';

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

@staticImplements<LdKeyPairStatic>()
export class Secp256k1KeyPair implements LdKeyPairInstance {
  public id: string;
  public type: string = 'JsonWebKey2020';
  public controller: string;
  public publicKey: Uint8Array;
  public privateKey?: Uint8Array;
  public alg?: string;

  static generate = async ({
    secureRandom,
    alg,
  }: {
    secureRandom: () => Uint8Array;
    alg?: string;
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
      alg,
    });
  };

  static from = async (
    k:
      | JsonWebKey2020
      | EcdsaSecp256k1VerificationKey2019
      | EcdsaSecp256k1VerificationKey2020
  ) => {
    const { publicKey, privateKey } = importableTypes[k.type](k as any);
    const secp256k1KeyPair = new Secp256k1KeyPair({
      id: k.id,
      type: k.type,
      controller: k.controller,
      publicKey,
      privateKey,
    });
    if ((k as any).publicKeyJwk?.alg) {
      secp256k1KeyPair.alg = (k as any).publicKeyJwk.alg;
    }
    return secp256k1KeyPair;
  };

  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    const buffer = base58.decode(fingerprint.substring(1));

    if (
      buffer[0] === SECP256K1_MULTICODEC_IDENTIFIER &&
      buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
    ) {
      let kp = await Secp256k1KeyPair.from({
        id: '',
        controller: '',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyBase58: base58.encode(buffer.slice(2)),
      });
      const f = await kp.fingerprint();
      kp.id = `did:key:${f}#${f}`;
      kp.controller = `did:key:${f}`;
      return kp;
    }
    throw new Error('Unsupported fingerprint type: ' + fingerprint);
  }

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
    alg?: string;
  }) {
    this.id = opts.id;
    this.type = opts.type || 'JsonWebKey2020';
    this.controller = opts.controller;
    this.publicKey = opts.publicKey;
    this.privateKey = opts.privateKey;
    this.alg = opts.alg;
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

  async export(
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
  ): Promise<
    | JsonWebKey2020
    | EcdsaSecp256k1VerificationKey2020
    | EcdsaSecp256k1VerificationKey2019
  > {
    if (exportableTypes[options.type]) {
      return exportableTypes[options.type](
        this.id,
        this.controller,
        this.publicKey,
        options.privateKey ? this.privateKey : undefined,
        this.alg
      );
    }
    throw new Error('Unsupported export options: ' + JSON.stringify(options));
  }
}
