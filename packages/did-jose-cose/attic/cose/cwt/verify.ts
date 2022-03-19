import { Verification } from "types";
import { CompactCwt, DocumentLoader, DidUrl } from "types";

const CWT = require("cwt-js");

export const verify = async (
  token: CompactCwt,
  kid: DidUrl,
  documentLoader: DocumentLoader
): Promise<Verification> => {
  const { document } = await documentLoader(kid);
  let verified = false;
  try {
    const params: any = {
      kid,
      x: Buffer.from(document.publicKeyJwk.x, "base64"),
    };
    if (document.publicKeyJwk.y) {
      params.y = Buffer.from(document.publicKeyJwk.y, "base64");
    }
    const payload = await CWT.parse(token, params);
    verified = true;
    return { verified, payload };
  } catch (e) {
    console.warn(e);
  }
  return { verified };
};
