import { contexts } from "@transmute/jsonld-document-loader";

import { issuers } from "./data/issuers.json";
import wallet_v1 from "./data/wallet-v1.json";
import bbs_v1 from "./data/bbs-v1.json";
import citizenship_v1 from "./data/citizenship-v1.json";
import sec_v3 from "./data/sec-v3.json";

import did from "@transmute/did-context";
import sec from "@transmute/security-context";
import cre from "@transmute/credentials-context";

const fixtureContexts: any = {
  // required for https://www.w3.org/2018/credentials/examples/v1
  ...contexts.W3C_Verifiable_Credentials,
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [did.constants.DID_CONTEXT_TRANSMUTE_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_TRANSMUTE_V1_URL
  ),
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
  "http://w3id.org/wallet/v1": wallet_v1,
  "https://w3id.org/security/bbs/v1": bbs_v1,
  "https://w3id.org/citizenship/v1": citizenship_v1,
  "https://w3id.org/security/v3-unstable": sec_v3
};

const documentLoader = (iri: string) => {
  if (fixtureContexts[iri]) {
    return {
      document: fixtureContexts[iri]
    };
  }
  const base = `${iri}`.split("#")[0];

  if ((issuers as any)[base]) {
    return {
      document: (issuers as any)[base]
    };
  }
  throw new Error("unsupported IRI " + iri);
};

export { documentLoader };
