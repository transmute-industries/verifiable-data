import secContexts from '@transmute/security-context';
import credContexts from '@transmute/credentials-context';
import didContexts from '@transmute/did-context';
import revContexts from '@transmute/revocation-list-context';

export const contexts: any = {
  [revContexts.constants
    .REVOCATION_LIST_CONTEXT_V1_URL]: revContexts.contexts.get(
    revContexts.constants.REVOCATION_LIST_CONTEXT_V1_URL
  ),
  [credContexts.constants
    .CREDENTIALS_CONTEXT_V1_URL]: credContexts.contexts.get(
    credContexts.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [secContexts.constants.SECURITY_CONTEXT_V1_URL]: secContexts.contexts.get(
    secContexts.constants.SECURITY_CONTEXT_V1_URL
  ),
  [secContexts.constants.SECURITY_CONTEXT_V2_URL]: secContexts.contexts.get(
    secContexts.constants.SECURITY_CONTEXT_V2_URL
  ),
  [didContexts.constants.DID_CONTEXT_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_V1_URL
  ),
  [didContexts.constants
    .DID_CONTEXT_TRANSMUTE_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_TRANSMUTE_V1_URL
  ),

  [secContexts.constants.ED25519_2018_v1_URL]: secContexts.contexts.get(
    secContexts.constants.ED25519_2018_v1_URL
  ),
};
