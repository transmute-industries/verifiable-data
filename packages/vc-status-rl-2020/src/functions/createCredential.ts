import { RevocationList2020 } from '../RevocationList2020';
import { CONTEXTS } from '../constants';

export const createCredential = async ({
  id,
  list,
}: {
  id: string;
  list: RevocationList2020;
}) => {
  const encodedList = await list.encode();
  return {
    '@context': [CONTEXTS.VC_V1, CONTEXTS.RL_V1],
    id,
    type: ['VerifiableCredential', 'RevocationList2020Credential'],
    credentialSubject: {
      id: `${id}#list`,
      type: 'RevocationList2020',
      encodedList,
    },
  };
};
