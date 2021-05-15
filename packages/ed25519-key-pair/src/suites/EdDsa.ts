import * as ed25519 from '@stablelib/ed25519';

export const signer = (privateKey: Uint8Array) => {
  return {
    async sign({ data }: any) {
      return ed25519.sign(privateKey, data);
    },
  };
};

export const verifier = (publicKey: Uint8Array) => {
  return {
    async verify({ data, signature }: any) {
      let verified = false;
      try {
        verified = ed25519.verify(publicKey, data, signature);
      } catch (e) {
        // console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
