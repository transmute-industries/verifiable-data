import cre from "@transmute/credentials-context";
import sec from "@transmute/security-context";
import did from "@transmute/did-context";

export const contexts: any = {
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
