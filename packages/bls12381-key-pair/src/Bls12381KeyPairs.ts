import { base58 } from './encoding';

import { Bls12381G1KeyPair } from './Bls12381G1KeyPair';
import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

import {
  generateBls12381G1KeyPair,
  generateBls12381G2KeyPair,
} from '@mattrglobal/bbs-signatures';

import {
  BLS12381G1ANDG2_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
  MULTIBASE_ENCODED_BASE58_IDENTIFIER,
} from './constants';

const generateKeyPairs = async (seed?: Uint8Array) => {
  const g1 = await generateBls12381G1KeyPair(seed);
  const g2 = await generateBls12381G2KeyPair(seed);

  const bls12381G1KeyPair = new Bls12381G1KeyPair({
    id: '',
    type: 'Bls12381G1Key2020',
    controller: '',
    publicKey: g1.publicKey,
    privateKey: g1.secretKey,
  });

  const bls12381G2KeyPair = new Bls12381G2KeyPair({
    id: '',
    type: 'Bls12381G2Key2020',
    controller: '',
    publicKey: g2.publicKey,
    privateKey: g2.secretKey,
  });

  return {
    bls12381G1KeyPair,
    bls12381G2KeyPair,
  };
};

const decoders: any = {
  z: base58.decode,
};

const prefixToKeyPair: any = {
  ea01: Bls12381G1KeyPair,
  eb01: Bls12381G2KeyPair,
};

export class Bls12381KeyPairs {
  public id: string;
  public type: string;
  public controller: string;
  public g1KeyPair: Bls12381G1KeyPair;
  public g2KeyPair: Bls12381G2KeyPair;

  constructor(options: any) {
    this.id = options.id;
    this.type = options.type;
    this.controller = options.controller;
    this.g1KeyPair = options.g1KeyPair;
    this.g2KeyPair = options.g2KeyPair;
  }

  static async generate(options: any) {
    let seed = undefined;
    if (options.secureRandom) {
      seed = Uint8Array.from(options.secureRandom());
    }
    const { bls12381G1KeyPair, bls12381G2KeyPair } = await generateKeyPairs(
      seed
    );
    const keypairs = new Bls12381KeyPairs({
      id: '',
      type: 'Bls12381KeyPairs',
      controller: '',
      g1KeyPair: bls12381G1KeyPair,
      g2KeyPair: bls12381G2KeyPair,
    });
    const fingerprint = await keypairs.fingerprint();
    keypairs.id = `did:key:${fingerprint}#${fingerprint}`;
    keypairs.controller = `did:key:${fingerprint}`;

    bls12381G1KeyPair.controller = keypairs.controller;
    bls12381G2KeyPair.controller = keypairs.controller;

    bls12381G1KeyPair.id =
      keypairs.controller + '#' + (await bls12381G1KeyPair.fingerprint());

    bls12381G2KeyPair.id =
      keypairs.controller + '#' + (await bls12381G2KeyPair.fingerprint());

    keypairs.g1KeyPair = bls12381G1KeyPair;
    keypairs.g2KeyPair = bls12381G2KeyPair;

    return keypairs;
  }

  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    const encoding = fingerprint[0];
    const decoded = decoders[encoding](fingerprint.substring(1));
    const prefix = decoded.slice(0, 2);
    if (prefixToKeyPair[prefix.toString('hex')]) {
      return prefixToKeyPair[prefix.toString('hex')].fromFingerprint({
        fingerprint,
      });
    }
    if (prefix.toString('hex') === 'ee01') {
      const g1Fingerprint =
        'z' +
        base58.encode(
          Buffer.concat([Buffer.from('ea01', 'hex'), decoded.slice(2, 50)])
        );
      const g2Fingerprint =
        'z' +
        base58.encode(
          Buffer.concat([Buffer.from('eb01', 'hex'), decoded.slice(50)])
        );
      const g1 = await Bls12381G1KeyPair.fromFingerprint({
        fingerprint: g1Fingerprint,
      });
      g1.id = `did:key:${fingerprint}#${g1.id.split('#').pop()}`;
      g1.controller = `did:key:${fingerprint}`;

      const g2 = await Bls12381G2KeyPair.fromFingerprint({
        fingerprint: g2Fingerprint,
      });
      g2.id = `did:key:${fingerprint}#${g2.id.split('#').pop()}`;
      g2.controller = `did:key:${fingerprint}`;
      return new Bls12381KeyPairs({
        id: `did:key:${fingerprint}#${fingerprint}`,
        type: 'Bls12381KeyPairs',
        controller: `did:key:${fingerprint}`,
        g1KeyPair: g1,
        g2KeyPair: g2,
      });
    }
  }

  async fingerprint() {
    const g1Buffer = Buffer.from(this.g1KeyPair.publicKey);
    const g2Buffer = Buffer.from(this.g2KeyPair.publicKey);
    const g1AndG2 = Buffer.concat([g1Buffer, g2Buffer]);
    const buffer = new Uint8Array(2 + g1AndG2.length);
    buffer[0] = BLS12381G1ANDG2_MULTICODEC_IDENTIFIER;
    buffer[1] = VARIABLE_INTEGER_TRAILING_BYTE;

    buffer.set(g1AndG2, 2);
    return `${MULTIBASE_ENCODED_BASE58_IDENTIFIER}${base58.encode(buffer)}`;
  }

  async getPairedKeyPairs() {
    return [this.g1KeyPair, this.g2KeyPair];
  }
}
