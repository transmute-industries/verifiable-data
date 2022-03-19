import { keyPairToAlg } from '../../keyPairToAlg';

const jose = require('jose');

export const verify = async (
  token: string,
  kid: string,
  documentLoader: any
): Promise<any> => {
  const { document } = await documentLoader(kid);
  const alg = keyPairToAlg(document.publicKeyJwk);
  const { payload } = await jose.jwtVerify(
    token,
    await jose.importJWK({
      alg,
      ...document.publicKeyJwk,
    })
  );
  return payload;
};
