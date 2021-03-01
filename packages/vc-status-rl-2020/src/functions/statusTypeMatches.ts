import { CONTEXTS } from '../constants';
export const statusTypeMatches = ({
  credential,
}: { credential?: any } = {}) => {
  if (!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  // check for expected contexts
  const { '@context': contexts } = credential;
  if (!Array.isArray(contexts)) {
    throw new TypeError('"@context" must be an array.');
  }
  if (contexts[0] !== CONTEXTS.VC_V1) {
    throw new Error(`The first "@context" value must be "${CONTEXTS.VC_V1}".`);
  }
  const { credentialStatus } = credential;
  if (!credentialStatus) {
    // no status; no match
    return false;
  }
  if (typeof credentialStatus !== 'object') {
    // bad status
    throw new Error('"credentialStatus" is invalid.');
  }
  if (!contexts.includes(CONTEXTS.RL_V1)) {
    // context not present, no match
    return false;
  }
  if (credentialStatus.type !== 'RevocationList2020Status') {
    // status type does not match
    return false;
  }
  return true;
};
