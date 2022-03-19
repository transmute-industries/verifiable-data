import { keyPairToAlg } from '../../keyPairToAlg';

const jose = require('jose');
export const sign = async (header: any, payload: any, privateKeyJwk: any) => {
  const alg = keyPairToAlg(privateKeyJwk);
  const jwt = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg, ...header })
    .setIssuedAt(payload.iat)
    .setIssuer(payload.iss)
    .setAudience(payload.aud)
    .setExpirationTime(payload.exp)
    .sign(await jose.importJWK({ alg, ...privateKeyJwk }));

  return jwt;
};
