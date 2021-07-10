const { constants: securityConstants } = require('@transmute/security-context');
const {
  constants: credentialsConstants,
} = require('@transmute/credentials-context');

export default {
  CREDENTIALS_CONTEXT_URL: 'https://www.w3.org/2018/credentials/v2',
  CREDENTIALS_CONTEXT_V1_URL: credentialsConstants.CREDENTIALS_CONTEXT_V1_URL,
  CREDENTIALS_CONTEXT_V2_URL: 'https://www.w3.org/2018/credentials/v2',
  SECURITY_CONTEXT_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  SECURITY_CONTEXT_V1_URL: securityConstants.SECURITY_CONTEXT_V1_URL,
  SECURITY_CONTEXT_V2_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  SECURITY_PROOF_URL: 'https://w3id.org/security#proof',
  SECURITY_SIGNATURE_URL: 'https://w3id.org/security#signature',
};
