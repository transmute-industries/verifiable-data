const authenticationMethodCurveTypes = ["Ed25519", "secp256k1", "P-256"];
const assertionMethodCurveTypes = [
  "Ed25519",
  "secp256k1",
  "BLS12381_G1",
  "BLS12381_G2",
  "P-256"
];
const capabilityInvocationCurveTypes = ["Ed25519", "P-256"];
const capabilityDelegationCurveTypes = [...capabilityInvocationCurveTypes];
const keyAgreementCurveTypes = ["X25519", "P-256"];

const allVerificationMethodCurveTypes = Array.from(
  new Set([
    ...authenticationMethodCurveTypes,
    ...assertionMethodCurveTypes,
    ...capabilityInvocationCurveTypes,
    ...capabilityDelegationCurveTypes,
    ...keyAgreementCurveTypes
  ])
);

export const getVerificationRelationship = (
  types: string[],
  collection: any[],
  idOnly = true
) => {
  return collection
    .filter(k => {
      return types.includes(k.publicKeyJwk.crv);
    })
    .map(k => {
      if (idOnly) {
        return k.id;
      }
      let k1 = { ...k };
      delete k1.privateKeyJwk;
      return k1;
    });
};

export const keysToDidDocument = (did: string, keys: any[]) => {
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://ns.did.ai/transmute/v1"
    ],
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
    assertionMethod: getVerificationRelationship(
      assertionMethodCurveTypes,
      keys
    ),
    capabilityInvocation: getVerificationRelationship(
      capabilityInvocationCurveTypes,
      keys
    ),
    capabilityDelegation: getVerificationRelationship(
      capabilityDelegationCurveTypes,
      keys
    ),
    keyAgreement: getVerificationRelationship(keyAgreementCurveTypes, keys)
  };
  return didDocument;
};
