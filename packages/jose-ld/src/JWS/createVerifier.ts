import { Verifier, JWA_ALG } from '../types';

export const createVerifier = (
  verifier: Verifier,
  type: JWA_ALG,
  options: any = {
    detached: false,
  }
) => {
  return {
    verify: async ({
      data,
      signature,
    }: {
      data?: Uint8Array;
      signature: string;
    }): Promise<boolean> => {
      if (!signature) {
        throw new Error('Signature cannot be empty.');
      }
      if (!signature.split) {
        signature = signature.toString();
      }
      const [encodedHeader, encodedPayload, encodedSignature] = signature.split(
        '.'
      );
      const decoded = JSON.parse(
        Buffer.from(encodedHeader, 'base64').toString()
      );

      if (decoded.alg !== type) {
        throw new Error('JWS.header contained unsupported alg: ' + decoded.alg);
      }

      let toBeSigned: any = `${encodedHeader}.${encodedPayload}`;

      if (options.detached && decoded.b64) {
        throw new Error('header.b64 must be false for detached jws.');
      }

      if (options.detached && !decoded.crit.includes('b64')) {
        throw new Error('header.crit must include "b64" for detached jws.');
      }

      if (options.detached && !data) {
        throw new Error('cannot verify a detached jws without data.');
      }

      if (options.detached && data) {
        toBeSigned = Buffer.concat([
          Buffer.from(encodedHeader + '.', 'utf8'),
          Buffer.from(data.buffer, data.byteOffset, data.length),
        ]);
      }

      const verified = verifier.verify({
        data: Buffer.from(toBeSigned),
        signature: Buffer.from(encodedSignature, 'base64'),
      });
      return verified;
    },
  };
};
