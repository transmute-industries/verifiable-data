import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
import documentLoader from "./__fixtures__/documentLoader";
const { verifiable } = require("../../universal/index");
const rawKeyJson = require("./__fixtures__/key.json");

const presentation = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: ["VerifiablePresentation"],
  holder: rawKeyJson.controller,
  verifiableCredential: [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded",
      type: ["VerifiableCredential"],
      issuer: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject:
        "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
      proof: {
        type: "Ed25519Signature2018",
        created: "2021-10-30T19:16:30Z",
        verificationMethod:
          "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        proofPurpose: "assertionMethod",
        jws:
          "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..puetBYS3pkYlYzAecBiT-WkigYAlVbslrz9wPFnk9JW4AwjrpJvcsSdZJPhZtNy_myMJUNzC_QaYyw3ni1V0BA"
      }
    }
  ]
};
let key: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;

describe("sign presentation with edd25519 2018 signature", () => {
  beforeAll(async () => {
    key = await Ed25519VerificationKey2018.from(rawKeyJson);
    suite = new Ed25519Signature2018({
      key,
      date: presentation.verifiableCredential[0].issuanceDate
    });
  });
  it("signs and verifies with challenge", async () => {
    const result = await verifiable.presentation.create({
      presentation,
      format: ["vp"],
      documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      suite
    });
    const result2 = await verifiable.presentation.verify({
      presentation: result.items[0],
      format: ["vp"],
      documentLoader: documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      suite: new Ed25519Signature2018()
    });
    expect(result2.verified).toBeTruthy();
  });
  it("signs and verifies with domain and challenge", async () => {
    const result = await verifiable.presentation.create({
      presentation,
      format: ["vp"],
      documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      domain: "supplier",
      suite
    });
    const result2 = await verifiable.presentation.verify({
      presentation: result.items[0],
      format: ["vp"],
      documentLoader: documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      domain: "supplier",
      suite: new Ed25519Signature2018()
    });
    expect(result2.verified).toBeTruthy();
  });
});
