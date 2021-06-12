import { base58 } from './encoding';

import { Bls12381G1KeyPair } from './Bls12381G1KeyPair';
import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

const decoders: any = {
  z: base58.decode,
};

const prefixToKeyPair: any = {
  ea01: Bls12381G1KeyPair,
  eb01: Bls12381G2KeyPair,
};

export class Bls12381KeyPairs {
  static async fromFingerprint({ fingerprint }: { fingerprint: string }) {
    const encoding = fingerprint[0];
    const decoded = decoders[encoding](fingerprint.substring(1));
    const prefix = decoded.slice(0, 2);
    const keys = [];
    if (prefixToKeyPair[prefix.toString('hex')]) {
      keys.push(
        prefixToKeyPair[prefix.toString('hex')].fromFingerprint({ fingerprint })
      );
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
      keys.push(
        Bls12381G1KeyPair.fromFingerprint({ fingerprint: g1Fingerprint })
      );
      keys.push(
        Bls12381G2KeyPair.fromFingerprint({ fingerprint: g2Fingerprint })
      );
    }
    return Promise.all(keys);
  }
}
