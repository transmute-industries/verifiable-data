import { contexts } from "./contexts";
import controller from "./controller";

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  return undefined;
};

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  if (iri.startsWith(controller.id)) {
    return { document: controller };
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
