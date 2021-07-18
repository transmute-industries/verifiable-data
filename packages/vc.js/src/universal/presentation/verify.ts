import * as ld from "../../vc-ld";
// import * as jwt from "../../vc-jwt";

export const verify = async (options: any) => {
  const result: any = {
    verified: false,
  };

  if (options.format.includes("vp") && options.presentation["@context"]) {
    const res = await ld.verifyVerifiablePresentation({
      presentation: options.presentation,
      suite: options.suite,
      domain: options.domain,
      challenge: options.challenge,
      documentLoader: options.documentLoader,
    });
    result.verified = res.verified;
  }

  // vp-jwt's are strings with an encoded vp member that conforms to the data model
  if (options.format.includes("vp-jwt") && !options.presentation["@context"]) {
    const [header] = options.presentation
      .split(".")
      .splice(0, 1)
      .map((item: string) => {
        return JSON.parse(Buffer.from(item, "base64").toString());
      });
    if (!header.kid) {
      throw new Error(
        'Transmute requires "kid" in vp-jwt headers. Otherwise key dereferencing is not always possible.'
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
      signature: options.presentation,
    });
    result.verified = verified;
  }

  return result;
};
