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
    sign: async ({ data }: { data: Uint8Array | any }): Promise<string> => {
      const header = {
        alg: type,
        ...options.header,
        ...(options.detached ? detachedHeaderParams : undefined),
      };
      const encodedHeader = base64url.encode(JSON.stringify(header));
      const encodedPayload = base64url.encode(
        data instanceof Uint8Array
          ? Buffer.from(data).toString('utf-8')
          : JSON.stringify(data)
      );

      const toBeSigned = options.detached
        ? new Uint8Array(
            Buffer.concat([
              Buffer.from(encodedHeader, 'utf8'),
              Buffer.from('.', 'utf-8'),
              data,
            ])
          )
        : new Uint8Array(Buffer.from(`${encodedHeader}.${encodedPayload}`));

      const message = toBeSigned as any;
      const signature = await signer.sign({ data: message });

      return options.detached
        ? `${encodedHeader}..${base64url.encode(Buffer.from(signature))}`
        : `${encodedHeader}.${encodedPayload}.${base64url.encode(
            Buffer.from(signature)
          )}`;
    },
  };
};
