import { contexts } from "./contexts";
const privateKeys = [
  require("./__fixtures__/ES256K.privateKeyJwk.json"),
  require("./__fixtures__/EdDSA.privateKeyJwk.json"),
  require("./__fixtures__/ES384.privateKeyJwk.json")
];

const crvToAlg: any = {
  Ed25519: "EdDSA",
  secp256k1: "ES256K",
  "P-384": "ES384"
};

const verificationMethod = privateKeys.map(privateKey => {
  const publicKeyJwk = JSON.parse(JSON.stringify(privateKey));
  delete publicKeyJwk["d"];
  return {
    id: "did:example:123#" + crvToAlg[privateKey.crv],
    controller: "did:example:123",
    type: "JsonWebKey2020",
    publicKeyJwk
  };
});

const assertionMethod = verificationMethod.map(vm => vm.id);
const authentication = verificationMethod.map(vm => vm.id);

const didDocument = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  id: "did:example:123",
  verificationMethod,
  assertionMethod,
  authentication
};

export const documentLoader = (iri: string) => {
  const iriWithoutFragment = iri.split("#")[0];
  if (contexts[iriWithoutFragment]) {
    return { document: contexts[iriWithoutFragment] };
  }
  if (iriWithoutFragment === didDocument.id) {
    return { document: didDocument };
  }
  const message = "Unsupported iri: " + iri;
  console.warn(message);
  throw new Error(message);
};
