export const contexts: any = {
  "https://www.w3.org/ns/did/v1": require("./did-v1.json"),
  "https://www.w3.org/2018/credentials/v1": require("./cred-v1.json"),
  "https://w3id.org/security/suites/ed25519-2018/v1": require("./ed25519-v1.json"),
  "https://w3id.org/security/suites/x25519-2019/v1": require("./x25519-v1.json"),
  "https://w3id.org/vc-revocation-list-2020/v1": require("./rev-v1.json"),
  "https://w3id.org/traceability/v1": require("./trace-v1.json"),
  // jws verify
  "https://w3id.org/security/suites/jws-2020/v1": require("./jws.json"),

  // required by revocation lists, ... should not be required....
  "https://w3id.org/security/v1": require("./sec-v1.json"),
  "https://w3id.org/security/v2": require("./sec-v2.json")
};
