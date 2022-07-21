import cre from "@transmute/credentials-context";
import sec from "@transmute/security-context";
import did from "@transmute/did-context";
import rev from "@transmute/revocation-list-context";

export const contexts: any = {
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
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
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [did.constants.DID_CONTEXT_TRANSMUTE_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_TRANSMUTE_V1_URL
  )
};

export const revocationContexts: any = {
  "https://w3id.org/traceability/v1": require("./trace-v1.json"),
  "https://w3id.org/vc-revocation-list-2020/v1": require("./revo-v1.json"),
  "https://www.w3.org/2018/credentials/v1": require("./cred-v1.json"),
  "http://localhost:8080/credentials/489ccb71-9352-44f8-ba4e-a8b6f03c44a0": require("./revocationListCredential2.json"),
  "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF": require("./revokedCredentialIssuer.json")
};
