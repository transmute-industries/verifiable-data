const dilithium = require("../../util/api");

export const signer = (privateKeyJwk: any) => {
  return {
    async sign({ data }: { data: Uint8Array }) {
      const api = await dilithium.init();
      const signature = await api.sign(data, privateKeyJwk);
      return Uint8Array.from(Buffer.from(signature, "base64"));
    },
  };
};

export const verifier = (publicKeyJwk: any) => {
  return {
    async verify({
      data,
      signature,
    }: {
      data: Uint8Array;
      signature: Uint8Array;
    }) {
      let verified = false;
      try {
        const api = await dilithium.init();
        const sig = Buffer.from(signature).toString("base64");
        verified = await api.verify(data, sig, publicKeyJwk);
      } catch (e) {
        // console.error('An error occurred when verifying signature: ', e);
      }
      return verified;
    },
  };
};
