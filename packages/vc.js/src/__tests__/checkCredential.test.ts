import credentialWithMS from "../__fixtures__/credentials/case-3.json";
import credentialWithTZOffset from "../__fixtures__/credentials/case-4.json";
import credentialWithLeapSecond from "../__fixtures__/credentials/case-5.json";
import vcJWTWithMS from "../__fixtures__/verifiable-credentials/case-1.jwt";
import vcJWTWithTZOffset from "../__fixtures__/verifiable-credentials/case-2.jwt";
import vcJWTWithLeapSecond from "../__fixtures__/verifiable-credentials/case-3.jwt";
import { checkCredential } from "../checkCredential";
import documentLoader from "../__fixtures__/documentLoader";

describe("checkCredential", () => {
  describe("linked data issuanceDate/expirationDate", () => {
    it("should not warn if datetime has milliseconds", async () => {
      let warned = false;
      try {
        await checkCredential(credentialWithMS, {
          documentLoader,
          strict: "throw"
        });
      } catch (err) {
        console.log(err);
        warned = true;
      }
      expect(warned).toBeFalsy();
    });
    it("should not warn if datetime has timezone", async () => {
      let warned = false;
      try {
        await checkCredential(credentialWithTZOffset, {
          documentLoader,
          strict: "throw"
        });
      } catch (err) {
        console.log(err);
        warned = true;
      }
      expect(warned).toBeFalsy();
    });
    it("should not warn if datetime has leap second", async () => {
      let warned = false;
      try {
        await checkCredential(credentialWithLeapSecond, {
          documentLoader,
          strict: "throw"
        });
      } catch (err) {
        console.log(err);
        warned = true;
      }
      expect(warned).toBeFalsy();
    });
  });
  describe("JWT issuanceDate/expirationDate nbf/exp", () => {
    it("should warn if nbf/exp loses info for ms", async () => {
      let warned = false;
      try {
        await checkCredential(vcJWTWithMS, { documentLoader, strict: "throw" });
      } catch (err) {
        warned = true;
      }
      expect(warned).toBeTruthy();
    });
    it("should warn if nbf/exp loses info for timezone", async () => {
      let warned = false;
      try {
        await checkCredential(vcJWTWithTZOffset, {
          documentLoader,
          strict: "throw"
        });
      } catch (err) {
        warned = true;
      }
      expect(warned).toBeTruthy();
    });
    it("should warn if nbf/exp loses info for leap second", async () => {
      let warned = false;
      try {
        await checkCredential(vcJWTWithLeapSecond, {
          documentLoader,
          strict: "throw"
        });
      } catch (err) {
        warned = true;
      }
      expect(warned).toBeTruthy();
    });
  });
});
