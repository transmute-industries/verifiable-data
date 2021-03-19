import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
import documentLoader from "./documentLoader";

export const verify = async (wallet) => {
  const suite = new Ed25519Signature2018();
  const verifiableContent = wallet.contents.filter((c) => {
    return c.proof && c.proof.type;
  });
  let verifications = [];
  for (let c of verifiableContent) {
    if (c.type.includes("VerifiablePresentation")) {
      const v = await wallet.verifyPresentation({
        presentation: c,
        options: {
          suite,
          domain: c.proof.domain,
          challenge: c.proof.challenge,
          documentLoader: documentLoader,
        },
      });
      verifications.push(v);
    }
    if (c.type.includes("VerifiableCredential")) {
      const v = await wallet.verifyCredential({
        credential: c,
        options: {
          suite,
          documentLoader: documentLoader,
        },
      });
      verifications.push(v);
    }
  }
  return verifications;
};
