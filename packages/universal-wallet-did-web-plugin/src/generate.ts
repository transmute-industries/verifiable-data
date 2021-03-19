import { convertEndpointToDid } from './convertEndpointToDid';
import { generateKeys } from './generateKeys';

const authenticationMethodCurveTypes = ['Ed25519', 'secp256k1', 'P-256'];
const assertionMethodCurveTypes = [
  'Ed25519',
  'secp256k1',
  'BLS12381_G1',
  'BLS12381_G2',
  'P-256',
];
const capabilityInvocationCurveTypes = ['Ed25519', 'P-256'];
const capabilityDelegationCurveTypes = [...capabilityInvocationCurveTypes];
const keyAgreementCurveTypes = ['X25519', 'P-256'];

const allVerificationMethodCurveTypes = Array.from(
  new Set([
    ...authenticationMethodCurveTypes,
    ...assertionMethodCurveTypes,
    ...capabilityInvocationCurveTypes,
    ...capabilityDelegationCurveTypes,
    ...keyAgreementCurveTypes,
  ])
);

const getKeys = async (did: string) => {
  return [
    ...(await generateKeys('ed25519')),
    ...(await generateKeys('x25519')),
    ...(await generateKeys('bls12381')),
    ...(await generateKeys('p-256')),
    ...(await generateKeys('secp256k1')),
  ].map((k: any, i: number) => {
    let k1 = k.toJsonWebKeyPair(true);
    k1.id = `${did}#key-${i}`;
    k1.controller = did;
    return k1;
  });
};

export const getVerificationRelationship = (
  types: string[],
  collection: any[],
  idOnly = true
) => {
  return collection
    .filter((k) => {
      return types.includes(k.publicKeyJwk.crv);
    })
    .map((k) => {
      if (idOnly) {
        return k.id;
      }
      let k1 = { ...k };
      delete k1.privateKeyJwk;
      return k1;
    });
};

export const generate = async (endpoint: string) => {
  const did = convertEndpointToDid(endpoint);
  const keys = await getKeys(did);
  const didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    verificationMethod: getVerificationRelationship(
      allVerificationMethodCurveTypes,
      keys,
      false
    ),
    authentication: getVerificationRelationship(
      authenticationMethodCurveTypes,
      keys
    ),
    assertionMethod: getVerificationRelationship(keyAgreementCurveTypes, keys),
    capabilityInvocation: getVerificationRelationship(
      capabilityInvocationCurveTypes,
      keys
    ),
    capabilityDelegation: getVerificationRelationship(
      capabilityDelegationCurveTypes,
      keys
    ),
    keyAgreement: getVerificationRelationship(keyAgreementCurveTypes, keys),
  };
  return { keys, didDocument };
};
