import sec from "@transmute/security-context";
import cre from "@transmute/credentials-context";
import did from "@transmute/did-context";
import { controller0, controller1 } from "./controllers";

const contexts: any = {
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
  [sec.constants.BLS12381_2020_V1_URL]: sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),
  // these are required for interop with mattr suite.
  "https://w3id.org/security/bbs/v1": sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),
  "https://w3id.org/security/v2": sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  "https://w3id.org/security/v1": sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  )
};

export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri]
    };
  }

  if (iri.startsWith(controller0.id)) {
    return {
      documentUrl: iri,
      document: controller0
    };
  }

  if (iri.startsWith(controller1.id)) {
    return {
      documentUrl: iri,
      document: controller1
    };
  }

  console.warn("Unsupported iri " + iri);
  throw new Error("Unsupported iri " + iri);
};
