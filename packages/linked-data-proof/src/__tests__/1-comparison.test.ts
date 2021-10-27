import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
import fs from "fs";
import path from "path";

import * as ldp from "..";
import rawKeyJson from "../__fixtures__/1-keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";

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
      (filename: string) => !["README.md", "case-1.json"].includes(filename)
    );
  });

  it("creates, compares, and verifies verifiable credential", async () => {
    for (const filename of files) {
      const credential = JSON.parse(
        fs.readFileSync(credentialsPath + "/" + filename).toString()
      );
      const purpose = {
        // ignore validation of dates and such...
        validate: () => {
          return { valid: true };
        },
        update: (proof: any) => {
          proof.proofPurpose = "assertionMethod";
          return proof;
        },
        match: async (proof: any, _options: any) => {
          return proof.proofPurpose === "assertionMethod";
        }
      };
      const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
      expect(keyPair.controller).toBe(rawKeyJson.controller);
      let suite;
      if (credential.issuanceDate !== undefined) {
        suite = new Ed25519Signature2018({
          key: keyPair,
          date: credential.issuanceDate
        });
      } else {
        // fallback default date
        suite = new Ed25519Signature2018({
          key: keyPair,
          date: "2010-01-01T19:23:24Z"
        });
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
      // FIXME: https://github.com/transmute-industries/verifiable-data/issues/99
      // We handle these dates variations differently than db does
      // 3 and 4 we don't convert to datetime xml format
      // 6 is a nonsense string we allowed and passed for the issuancedate to created
      // 7 we allow and pass empty strings for issuancedate to created
      // 8 for null issuancedate we use epoch time where db uses current time
      if (
        [
          "case-3.json",
          "case-4.json",
          "case-6.json",
          "case-7.json",
          "case-8.json"
        ].includes(filename)
      ) {
        expect(expectedVerifiableCredential).not.toEqual(verifiableCredential);
      } else {
        expect(expectedVerifiableCredential).toEqual(verifiableCredential);
      }
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
