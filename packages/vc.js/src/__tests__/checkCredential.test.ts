import credential from "../__fixtures__/credentials/case-3.json";
import vcJWt from "../__fixtures__/verifiable-credentials/case-1.jwt";
import { checkCredential } from "../checkCredential";
import documentLoader from "../__fixtures__/documentLoader";

describe("checkCredential", () => {
  it("should not warn if issuanceDate datetime has milliseconds", async () => {
    let warned = false;
    try {
      await checkCredential(credential, { documentLoader, strict: "throw" });
    } catch (err) {
      warned = true;
    }
    expect(warned).toBeFalsy();
  });
  it("should warn if issuance datetime has ms and is a JWT", async () => {
    let warned = false;
    try {
      await checkCredential(vcJWt, { documentLoader, strict: "throw" });
    } catch (err) {
      warned = true;
    }
    expect(warned).toBeTruthy();
  });
});
