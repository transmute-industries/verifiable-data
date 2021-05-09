import crypto from '../crypto';
import secp256k1 from 'secp256k1';

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
      const messageHashUInt8Array = crypto
        .createHash('sha256')
        .update(data)
        .digest();
      let verified = false;
      try {
        verified = secp256k1.ecdsaVerify(
          signature,
          messageHashUInt8Array,
          new Uint8Array(publicKey)
        );
      } catch (e) {
        // console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
