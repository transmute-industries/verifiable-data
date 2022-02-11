import { KeyManagementServiceClient } from '@google-cloud/kms';

export const getOrCreateKeyRing = async (
  client: KeyManagementServiceClient,
  projectId: string,
  locationId: string,
  keyRingName: string
) => {
  try {
    const [maybeKeyRing] = await client.getKeyRing({
      name: client.keyRingPath(projectId, locationId, keyRingName),
    });
    return maybeKeyRing;
  } catch (e) {
    const [keyRing] = await client.createKeyRing({
      parent: client.locationPath(projectId, locationId),
      keyRingId: keyRingName,
    });
    return keyRing;
  }
};
