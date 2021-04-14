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
    // FIXME: this wont be necessary once we update the ed25519 did key driver
    didDocument['@context'].push('https://ns.did.ai/transmute/v1');
    return {
      documentUrl: iri,
      document: didDocument
    };
  }

  console.error("Unsupporteed iri " + iri);
  throw new Error("Unsupporteed iri " + iri);
};
