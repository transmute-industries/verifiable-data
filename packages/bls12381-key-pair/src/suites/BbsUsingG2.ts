import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';
import { base58 } from '../encoding';

export const signer = (privateKey: Uint8Array, publicKey: Uint8Array) => {
  return {
    async sign({ data }: any) {
      const k = new Bls12381G2KeyPair({
        id: '',
        publicKeyBase58: base58.encode(publicKey),
        privateKeyBase58: base58.encode(privateKey),
      });
      const nestedSigner = k.signer();
      return nestedSigner.sign({ data });
    },
  };
};

export const verifier = (publicKey: Uint8Array) => {
  return {
    async verify({ data, signature }: any) {
      const k = new Bls12381G2KeyPair({
        id: '',
        publicKeyBase58: base58.encode(publicKey),
      });
      const nestedVerifier = k.verifier();
      return nestedVerifier.verify({ data, signature });
    },
  };
};
