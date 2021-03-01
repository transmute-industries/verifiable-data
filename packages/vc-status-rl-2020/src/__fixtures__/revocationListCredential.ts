import { encodedList100KWith50KthRevoked } from './encodedList100KWith50KthRevoked';
import { CONTEXTS } from '../constants';

export const revocationListCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
  id: 'https://example.com/status/1',
  issuer: 'did:key:z6MknUVLM84Eo5mQswCqP7f6oNER84rmVKkCvypob8UtBC8K',
  issuanceDate: '2020-03-10T04:24:12.164Z',
  type: ['VerifiableCredential', 'RevocationList2020Credential'],
  credentialSubject: {
    id: `https://example.com/status/1#list`,
    type: 'RevocationList2020',
    encodedList: encodedList100KWith50KthRevoked,
  },
};
