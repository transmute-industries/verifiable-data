import { KeyManagementServiceClient } from '@google-cloud/kms';
import { getOrCreateKeyRing } from './getOrCreateKeyRing';
import { getAllKeys } from './getAllKeys';
import { createNewKey } from './createNewKey';
import { getVerificationMethodsFromKeys } from './getVerificationMethodsFromKeys';

const getDidDocument = (vms: any[]) => {
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: vms[0].controller,
    verificationMethod: vms,
    assertionMethod: vms.map(vm => {
      return vm.id;
    }),
    authentication: vms.map(vm => {
      return vm.id;
    }),
  };
};

const convertEndpointToDid = (endpoint: string): string => {
  const url = new URL(endpoint);
  const { pathname } = url;

  let { host } = url;
  if (host.includes(':')) {
    host = encodeURIComponent(host);
  }

  if (endpoint.includes('.well-known/did.json')) {
    return `did:web:${host}`;
  }
  return `did:web:${host}${pathname
    .replace(/\//g, ':')
    .replace(':did.json', '')}`;
};

export const getDidWebFromGoogleKms = async (
  endpoint: string,
  client: KeyManagementServiceClient,
  projectId: string,
  locationId: string,
  keyRingName: string
) => {
  const did = convertEndpointToDid(endpoint);

  await getOrCreateKeyRing(client, projectId, locationId, keyRingName);
  let keys = await getAllKeys(client, projectId, locationId, keyRingName);
  if (keys.length === 0) {
    await createNewKey(client, projectId, locationId, keyRingName);
    keys = await getAllKeys(client, projectId, locationId, keyRingName);
  }
  const verificationMethods = await getVerificationMethodsFromKeys(
    did,
    client,
    keys
  );
  const didDocument = await getDidDocument(verificationMethods);
  return didDocument;
};
