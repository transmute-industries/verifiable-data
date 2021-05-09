import crypto from '../crypto';
import secp256k1 from 'secp256k1';

export const signer = (privateKey: Uint8Array) => {
  return {
    async sign({ data }: any) {
      const messageHashUInt8Array = crypto
        .createHash('sha256')
        .update(data)
        .digest();

      const { signature, recid }: any = secp256k1.ecdsaSign(
        messageHashUInt8Array,
        privateKey
      );

      return Uint8Array.from(
        Buffer.concat([
          Buffer.from(signature),
          Buffer.from(new Uint8Array([recid])),
        ])
      );
    },
  };
};

export const verifier = (publicKey: Uint8Array) => {
  return {
    async verify({ data, signature }: any) {
      const digest = crypto
        .createHash('sha256')
        .update(data)
        .digest();
      let verified = false;

      const recoveredPublicKey = secp256k1.ecdsaRecover(
        signature.slice(0, 64),
        signature[64],
        digest
      );

      try {
        verified =
          Buffer.from(publicKey).toString('hex') ===
          Buffer.from(recoveredPublicKey).toString('hex');
      } catch (e) {
        console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
