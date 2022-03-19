import { keyPairToAlg } from "../../keyPairToAlg";

import { CompactJwt, PrivateKeyJwk, Header, Payload } from "types";

const jose = require("jose");

export const sign = async (
  header: Header,
  payload: Payload,
  privateKeyJwk: PrivateKeyJwk
): Promise<CompactJwt> => {
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
