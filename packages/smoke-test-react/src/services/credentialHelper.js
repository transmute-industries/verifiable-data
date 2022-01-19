import { documentLoader } from "./documentLoader";
import { JsonWebSignature, JsonWebKey } from "@transmute/json-web-signature";

import { verifiable } from "@transmute/vc.js";

export const credentialHelper = async (key) => {
  const result = await verifiable.credential.create({
    credential: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/jws-2020/v1",
      ],
      id: "http://example.edu/credentials/3732",
      type: ["VerifiableCredential"],
      issuer: key.controller,
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
      },
    },
    format: ["vc", "vc-jwt"],
    documentLoader: documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key),
    }),
  });
  return result;
};
