import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
import fs from "fs";
import path from "path";

import * as ldp from "..";
import rawKeyJson from "../__fixtures__/1-keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";

const purpose = new ldp.purposes.AssertionProofPurpose();
console.warn = () => {};
describe("credential comparisons", () => {
  let credentialsPath: string;
  let files: string[] = [];

  beforeAll(async () => {
    credentialsPath = path.join(__dirname, "..", "__fixtures__/1-credentials");
    files = await new Promise((resolve, reject) => {
      fs.readdir(credentialsPath, (err, files) => {
        if (err) {
          reject("unable to scan path");
        }
        resolve(files);
      });
    });
    files = files.filter(
      (filename: string) =>
        ![
          "README.md",
          "case-1.json",
          "case-5.json",
          "case-8.json",
          "case-9.json"
        ].includes(filename)
    );
  });

  it("creates, compares, and verifies verifiable credential", async () => {
    for (const filename of files) {
      const credential = JSON.parse(
        fs.readFileSync(credentialsPath + "/" + filename).toString()
      );
      const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
      expect(keyPair.controller).toBe(rawKeyJson.controller);

      let suite;
      switch (credential.issuanceDate) {
        case undefined:
        case "":
        case null:
        case "foobar":
          suite = new Ed25519Signature2018({
            key: keyPair,
            date: "2010-01-01T19:23:24Z"
          });
          break;
        default:
          suite = new Ed25519Signature2018({
            key: keyPair,
            date: credential.issuanceDate
          });
          break;
      }
      expect(suite.verificationMethod).toBe(rawKeyJson.id);
      const verifiableCredential = await ldp.sign(credential, {
        suite,
        purpose,
        documentLoader,
        expansionMap: false,
        compactProof: false
      });
      const verifiableCredentialsPath = path.join(
        __dirname,
        "..",
        "__fixtures__/1-verifiable-credentials/digital-bazaar"
      );
      const expectedVerifiableCredential = JSON.parse(
        fs.readFileSync(verifiableCredentialsPath + "/" + filename).toString()
      );

      expect(expectedVerifiableCredential).toEqual(verifiableCredential);

      const result = await ldp.verify(verifiableCredential, {
        suite: new Ed25519Signature2018(),
        purpose,
        documentLoader,
        expansionMap: false,
        compactProof: false
      });
      expect(verifiableCredential.proof["@context"]).toBeFalsy();
      expect(result.verified).toBeTruthy();
    }
  });
});
