import crypto from '../crypto';
import secp256k1 from 'secp256k1';
import { instantiateSecp256k1 } from '@bitauth/libauth';
export const signer = (privateKey: Uint8Array) => {
  return {
    async sign({ data }: any) {
      const messageHashUInt8Array = crypto
        .createHash('sha256')
        .update(data)
        .digest();
      const sigObj: any = secp256k1.ecdsaSign(
        messageHashUInt8Array,
        new Uint8Array(privateKey)
      );
      return sigObj.signature;
    },
  };
};

export const verifier = (publicKey: Uint8Array) => {
  return {
    async verify({ data, signature }: any) {
      const instance = await instantiateSecp256k1();
      let verified = false;
      try {
        const msgHash = crypto
          .createHash('sha256')
          .update(data)
          .digest();
        verified = await instance.verifySignatureCompact(
          signature,
          publicKey,
          msgHash
        );
      } catch (e) {
        // console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
