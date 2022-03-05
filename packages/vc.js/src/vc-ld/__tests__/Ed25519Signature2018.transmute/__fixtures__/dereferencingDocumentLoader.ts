import { contexts } from "./contexts";
import controller from "./controller.json";

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  return undefined;
};

const documentResolver = async (iri: string) => {
  if (iri.startsWith(controller.id)) {
    return {
      documentUrl: controller.id,
      document: controller
    };
  }
  return undefined;
};

// Note: you implement this without using JSON-LD frame,
// but it MUST return a document with an @context.
const documentDereferencer = async (document: any, iri: string) => {
  try {
    const methodResponse = {
      "@context": document["@context"],
      ...document.verificationMethod[0],
      controller: {
        id: document.id
      }
    };
    return {
      documentUrl: iri,
      document: methodResponse
    };
  } catch (e) {
    console.error("documentDereferencer frame failed on: " + iri);
  }
  return undefined;
};

export const dereferencingDocumentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  const resolution = await documentResolver(iri);
  if (resolution?.documentUrl === iri) {
    return resolution;
  }

  if (resolution && iri.startsWith(resolution?.documentUrl)) {
    const dereference = await documentDereferencer(resolution?.document, iri);
    if (dereference?.document) {
      return dereference;
    }
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
