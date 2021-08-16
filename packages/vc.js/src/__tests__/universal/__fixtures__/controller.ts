import key from "./key.json";

const vm = JSON.parse(JSON.stringify(key));
delete vm.privateKeyJwk;

export default {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  id: vm.controller,
  verificationMethod: [vm],
  assertionMethod: [vm.id],
  authentication: [vm.id],
  capabilityInvocation: [vm.id],
  capabilityDelegation: [vm.id],
  keyAgreement: [vm.id]
};
