import cre from "@transmute/credentials-context";
import sec from "@transmute/security-context";
import did from "@transmute/did-context";
import rev from "@transmute/revocation-list-context";

import citizenshipV1 from "./citizenship-v1.json";

export const contexts: any = {
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [sec.constants.X25519_2019_v1_URL]: sec.contexts.get(
    sec.constants.X25519_2019_v1_URL
  ),
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [rev.constants.REVOCATION_LIST_CONTEXT_V1_URL]: rev.contexts.get(
    rev.constants.REVOCATION_LIST_CONTEXT_V1_URL
  ),
  "https://w3id.org/citizenship/v1": citizenshipV1,
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  )
};
