import * as did from "@transmute/did-context";
import * as sec from "@transmute/security-context";
import * as cre from "@transmute/credentials-context";
import didDocument from "./didDocument.json";
import verifiableCredential from "./verifiableCredential.json";

export { didDocument, verifiableCredential };

export const credential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "http://example.gov/credentials/3732",
  type: ["VerifiableCredential"],
  issuer: {
    id: "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
  },
  issuanceDate: "2021-06-19T18:53:11Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  },
};

const contexts: any = {
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [sec.constants.X25519_2019_v1_URL]: sec.contexts.get(
    sec.constants.X25519_2019_v1_URL
  ),

  // used to test JsonWebKey2020 backward compatibility
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
};

export const documentLoader = async (iri: string) => {
  if (
    iri.startsWith("did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT")
  ) {
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.error("Unsupported iri: " + iri);
  throw new Error("Unsupported iri: " + iri);
};
