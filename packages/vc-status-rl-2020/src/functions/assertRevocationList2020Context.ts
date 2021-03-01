import { CONTEXTS } from '../constants';
export const assertRevocationList2020Context = ({
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
  if (!contexts.includes(CONTEXTS.RL_V1)) {
    throw new TypeError(`"@context" must include "${CONTEXTS.RL_V1}".`);
  }
};
