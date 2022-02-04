import { contexts } from "./contexts";
import controller from "./controller.json";
import * as ed25519 from "@transmute/did-key-ed25519";

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  return undefined;
};

const documentResolver = async (iri: string) => {
  if (iri.startsWith(controller.id)) {
    const { didDocument } = await ed25519.resolve(controller.id);
    return {
      documentUrl: controller.id,
      document: didDocument
    };
  }
  return undefined;
};

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  const resolution = await documentResolver(iri);
  if (resolution) {
    return resolution;
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
