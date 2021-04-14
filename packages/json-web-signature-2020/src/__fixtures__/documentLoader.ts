import securityContexts from '@transmute/security-context';
import credentialsContexts from '@transmute/credentials-context';
import didContexts from '@transmute/did-context';

import { SUITE_CONTEXT } from '../JsonWebSignature';
const contexts: any = {
  [securityContexts.constants
    .SECURITY_CONTEXT_V1_URL]: securityContexts.contexts.get(
    securityContexts.constants.SECURITY_CONTEXT_V1_URL
  ),
  [securityContexts.constants
    .SECURITY_CONTEXT_V2_URL]: securityContexts.contexts.get(
    securityContexts.constants.SECURITY_CONTEXT_V2_URL
  ),
  [credentialsContexts.constants
    .CREDENTIALS_CONTEXT_V1_URL]: credentialsContexts.contexts.get(
    credentialsContexts.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [didContexts.constants.DID_CONTEXT_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_V1_URL
  ),
  [didContexts.constants.DID_CONTEXT_TRANSMUTE_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_TRANSMUTE_V1_URL
  ),
  ...SUITE_CONTEXT,
};

export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.warn('Unsupported iri ' + iri);
  throw new Error('Unsupported iri ' + iri);
};
