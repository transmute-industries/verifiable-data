import { contexts } from "./contexts";
import * as ed25519 from "@transmute/did-key-ed25519";

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri]
    };
  }

  if (iri.startsWith("did:key:z6M")) {
    const { didDocument } = await ed25519.driver.resolve(iri, {
      accept: "application/did+ld+json"
    });
    return {
      documentUrl: iri,
      document: didDocument
    };
  }

  console.error("Unsupporteed iri " + iri);
  throw new Error("Unsupporteed iri " + iri);
};
