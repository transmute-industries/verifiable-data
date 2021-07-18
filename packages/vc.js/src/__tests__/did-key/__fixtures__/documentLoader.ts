import { contexts } from "./contexts";
import { controllers } from "./controllers";

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

  const withoutFragment = iri.split("#")[0];
  if (controllers[withoutFragment]) {
    return { document: controllers[withoutFragment] };
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
