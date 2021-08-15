import ed25519 from "./keys/ed25519.json";
import secp256k1 from "./keys/secp256k1.json";
import secp384r1 from "./keys/secp384r1.json";
import bls12381 from "./keys/bls12381.json";

export const registeredKeys = [ed25519, secp256k1, secp384r1];
export const unRegisteredKeys = [bls12381];

export const allKeys = [...registeredKeys, ...unRegisteredKeys];

const makeController = (key: any) => {
  const vm = JSON.parse(JSON.stringify(key));
  delete vm.privateKeyJwk;
  delete vm.privateKeyBase58;
  return {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1",
      "https://w3id.org/security/suites/bls12381-2020/v1"
    ],
    id: vm.controller,
    verificationMethod: [vm],
    assertionMethod: [vm.id],
    authentication: [vm.id]
  };
};

let controllers: any = {};

allKeys.forEach((k: any) => {
  controllers = {
    ...controllers,
    [k.controller]: makeController(k)
  };
});

export { controllers };
