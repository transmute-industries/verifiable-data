import { Signer, JWA_ALG } from '../types';
import { base64url } from '../encoding';
import { detachedHeaderParams } from './detachedHeaderParams';

export const createSigner = (
  signer: Signer,
  type: JWA_ALG,
  options: any = {
    detached: false,
  }
) => {
  return {
    sign: async ({ data }: { data: Uint8Array }): Promise<string> => {
      const header = {
        alg: type,
        ...(options.detached ? detachedHeaderParams : undefined),
      };
      const encodedHeader = base64url.encode(JSON.stringify(header));
      const encodedPayload = base64url.encode(
        JSON.stringify(Buffer.from(data).toString('utf-8'))
      );

      const toBeSigned = options.detached
        ? Buffer.concat([
            Buffer.from(encodedHeader + '.', 'utf8'),
            Buffer.from(data.buffer, data.byteOffset, data.length),
          ])
        : `${encodedHeader}.${encodedPayload}`;

      const message = Buffer.from(toBeSigned);
      const signature = await signer.sign({ data: message });

      return options.detached
        ? `${encodedHeader}..${base64url.encode(signature)}`
        : `${encodedHeader}.${encodedPayload}.${base64url.encode(signature)}`;
    },
  };
};
