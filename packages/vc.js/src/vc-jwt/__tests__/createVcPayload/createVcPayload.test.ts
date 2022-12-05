import { createVcPayload } from "../../createVcPayload";
import { credential, credential2, documentLoader } from "./__fixtures__";

describe("createVcPayload", () => {
  it("should remove sub if credentialSubject is an object that does not have id attribute", async () => {
    const options = {
      format: "vc-jwt",
      documentLoader
    };
    const payload: any = await createVcPayload(credential, options);
    expect(payload.sub).toBeFalsy();
  });

  it("sub should be id string if credentialSubject is an object that does have id attribute", async () => {
    const options = {
      format: "vc-jwt",
      documentLoader
    };
    const payload: any = await createVcPayload(credential2, options);
    expect(payload.sub).toBe(credential2.credentialSubject.id);
  });
});
