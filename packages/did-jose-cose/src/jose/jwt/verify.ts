import { Verification, CompactJwt, DocumentLoader, DidUrl } from "types";
import { keyPairToAlg } from "../../keyPairToAlg";

const jose = require("jose");

export const verify = async (
  token: CompactJwt,
  kid: DidUrl,
  documentLoader: DocumentLoader
): Promise<Verification> => {
  const { document } = await documentLoader(kid);
  const alg = keyPairToAlg(document.publicKeyJwk);
  let verified = false;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importJWK({
        alg,
        ...document.publicKeyJwk,
      })
    );
    verified = true;
    return { verified, payload };
  } catch (e) {
    console.warn(e);
  }
  return { verified };
};
