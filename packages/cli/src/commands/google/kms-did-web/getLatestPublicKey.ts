import { KeyManagementServiceClient } from '@google-cloud/kms';

export const getLatestPublicKey = async (
  client: KeyManagementServiceClient,
  keyId: string
): Promise<any> => {
  const [versions] = await client.listCryptoKeyVersions({
    parent: keyId,
    filter: 'state != DESTROYED AND state != DESTROY_SCHEDULED',
  });

  // todo: is this really the latest version?
  const [publicKey] = await client.getPublicKey({
    name: versions[0].name,
  });

  return publicKey;
};
