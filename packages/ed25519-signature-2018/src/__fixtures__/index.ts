import { contexts } from "./contexts";
import verifiableCredential from "./verifiableCredential.json";
import rawKeyJson from "./rawKeyJson.json";
import rawKeyJsonLd from "./rawKeyJsonLd.json";
import credential from "./credential.json";
export { credential, verifiableCredential, rawKeyJson, rawKeyJsonLd };

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.error("Unsupported iri: " + iri);
  throw new Error("Unsupported iri: " + iri);
};
