import uuid from 'uuid';
import { KeyManagementServiceClient } from '@google-cloud/kms';

export const createNewKey = async (
  client: KeyManagementServiceClient,
  projectId: string,
  locationId: string,
  keyRingName: string,
  type = 'P-384'
) => {
  let alg;
  switch (type) {
    case 'P-384': {
      alg = 'EC_SIGN_P384_SHA384';
      break;
    }
  }
  const result = await client.createCryptoKey({
    parent: client.keyRingPath(projectId, locationId, keyRingName),
    cryptoKeyId: uuid.v4(),
    cryptoKey: {
      purpose: 'ASYMMETRIC_SIGN',
      versionTemplate: {
        algorithm: alg as any,
      },
    },
  });

  if (result) {
    const [key] = result;
    return key;
  }
  throw new Error('Could not create key: ' + type);
};
