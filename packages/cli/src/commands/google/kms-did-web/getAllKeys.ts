import { KeyManagementServiceClient } from '@google-cloud/kms';

export const getAllKeys = async (
  client: KeyManagementServiceClient,
  projectId: string,
  locationId: string,
  keyRingName: string
) => {
  const [keys] = await client.listCryptoKeys({
    parent: client.keyRingPath(projectId, locationId, keyRingName),
  });
  return keys;
};
