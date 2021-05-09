import crypto from '../crypto';
import { instantiateSecp256k1 } from '@bitauth/libauth';

export const signer = (privateKey: Uint8Array) => {
  return {
    async sign({ data }: any) {
      const instance = await instantiateSecp256k1();
      const digest = crypto
        .createHash('sha256')
        .update(data)
        .digest();
      return instance.signMessageHashSchnorr(privateKey, digest);
    },
  };
};

export const verifier = (publicKey: Uint8Array) => {
  return {
    async verify({ data, signature }: any) {
      const instance = await instantiateSecp256k1();
      const digest = crypto
        .createHash('sha256')
        .update(data)
        .digest();
      let verified = false;
      try {
        verified = instance.verifySignatureSchnorr(
          signature,
          publicKey,
          digest
        );
      } catch (e) {
        console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
