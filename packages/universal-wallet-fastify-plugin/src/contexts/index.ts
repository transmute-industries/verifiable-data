import sec from '@transmute/security-context';
import cre from '@transmute/credentials-context';
import didContexts from '@transmute/did-context';
import rlContexts from '@transmute/revocation-list-context';
import walletV1 from './wallet-v1.json';
import didConfigV1 from './did-config-v1.json';
import secV3 from './sec-v3.json';
import bbsV1 from './bbs-v1.json';
import citV1 from './citizenship-v1.json';

export const contexts: any = {
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [didContexts.constants.DID_CONTEXT_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_V1_URL
  ),
  [didContexts.constants
    .DID_CONTEXT_TRANSMUTE_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_TRANSMUTE_V1_URL
  ),
  [rlContexts.constants
    .REVOCATION_LIST_CONTEXT_V1_URL]: rlContexts.contexts.get(
    rlContexts.constants.REVOCATION_LIST_CONTEXT_V1_URL
  ),
  'http://w3id.org/wallet/v1': walletV1,
  'https://identity.foundation/.well-known/contexts/did-configuration-v0.2.jsonld': didConfigV1,
  'https://w3id.org/security/v3-unstable': secV3,
  'https://w3id.org/security/bbs/v1': bbsV1,
  'https://w3id.org/citizenship/v1': citV1,
};
