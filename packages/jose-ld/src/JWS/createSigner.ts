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
    sign: async ({
      data,
    }: {
      data: Uint8Array | object | string;
    }): Promise<string> => {
      const header = {
        alg: type,
        ...(options.detached ? detachedHeaderParams : undefined),
        ...options.header,
      };
      const encodedHeader = base64url.encode(JSON.stringify(header));
      const encodedPayload = base64url.encode(
        typeof data === 'string' ? data : JSON.stringify(data)
      );

      const toBeSigned = options.detached
        ? new Uint8Array(
            Buffer.concat([
              Buffer.from(encodedHeader, 'utf8'),
              Buffer.from('.', 'utf-8'),
              data as Uint8Array,
            ])
          )
        : `${encodedHeader}.${encodedPayload}`;

      const message = toBeSigned as any;
      const signature = await signer.sign({ data: message });

      return options.detached
        ? `${encodedHeader}..${base64url.encode(Buffer.from(signature))}`
        : `${encodedHeader}.${encodedPayload}.${base64url.encode(signature)}`;
    },
  };
};
