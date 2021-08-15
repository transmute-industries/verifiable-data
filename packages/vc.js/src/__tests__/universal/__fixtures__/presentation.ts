import { items } from "./credential-create.json";
export default {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  type: ["VerifiablePresentation"],
  holder: {
    id: "did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr"
  },
  verifiableCredential: items
};
