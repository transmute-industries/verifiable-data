import { CONTEXTS } from '../constants';
import rev_v1 from './rev-v1.json';

import secContexts from '@transmute/security-context';
import credContexts from '@transmute/credentials-context';
import didContexts from '@transmute/did-context';

export const contexts = {
  [CONTEXTS.RL_V1]: rev_v1,
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
};
