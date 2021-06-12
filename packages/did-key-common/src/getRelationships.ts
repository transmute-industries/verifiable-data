const signer = [
  'assertionMethod',
  'authentication',
  'capabilityInvocation',
  'capabilityDelegation',
];

const deriveSecret = ['keyAgreement'];

const relationships: any = {
  'OKP Ed25519': [...signer],
  'OKP X25519': [...deriveSecret],

  Ed25519VerificationKey2018: [...signer],
  X25519KeyAgreementKey2019: [...deriveSecret],

  'EC BLS12381_G1': [...signer],
  'EC BLS12381_G2': [...signer],
  Bls12381G1Key2020: [...signer],
  Bls12381G2Key2020: [...signer],
};

export const getRelationships = (vm: any) => {
  const index =
    vm.type === 'JsonWebKey2020'
      ? `${vm.publicKeyJwk.kty} ${vm.publicKeyJwk.crv}`
      : vm.type;
  return [...(relationships[index] || [])];
};
