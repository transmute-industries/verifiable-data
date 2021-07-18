import * as ld from "../../vc-ld";
// import * as jwt from "../../vc-jwt";

export const verify = async (options: any) => {
  const result: any = {
    verified: false,
  };

  if (options.format.includes("vc") && options.credential["@context"]) {
    const res = await ld.verifyVerifiableCredential({
      credential: options.credential,
      suite: options.suite,
      documentLoader: options.documentLoader,
    });
    result.verified = res.verified;
  }

  // vc-jwt's are strings with an encoded vc member that conforms to the data model
  if (options.format.includes("vc-jwt") && !options.credential["@context"]) {
    const [header] = options.credential
      .split(".")
      .splice(0, 1)
      .map((item: string) => {
        return JSON.parse(Buffer.from(item, "base64").toString());
      });
    if (!header.kid) {
      throw new Error(
        'Transmute requires "kid" in vc-jwt headers. Otherwise key dereferencing is not always possible.'
      );
    }
    let suite = Array.isArray(options.suite) ? options.suite[0] : options.suite;
    const verificationMethod = await suite.getVerificationMethod({
      proof: {
        verificationMethod: header.kid,
      },
      documentLoader: options.documentLoader,
      instance: true, // need this to get the class instance
    });
    const k = await verificationMethod.useJwa({
      detached: false,
    });
    const verifier = k.verifier();
    const verified = await verifier.verify({
      signature: options.credential,
    });
    result.verified = verified;
  }

  return result;
};
