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

// NEED to update our libraries to support this code block.
// // Note: you implement this without using JSON-LD frame,
// // but it MUST return a document with an @context.
// const documentDereferencer = async (document: any, iri: string) => {
//   try {
//     const frame = await jsonld.frame(
//       document,
//       {
//         "@context": document["@context"],
//         "@embed": "@always",
//         id: iri,
//       },
//       {
//         documentLoader: (iri: string) => {
//           // use the cache of the document we just resolved when framing
//           if (iri === document.id) {
//             return {
//               documentUrl: iri,
//               document,
//             };
//           }
//           return contextResolver(iri);
//         },
//       }
//     );
//     return {
//       documentUrl: iri,
//       document: frame,
//     };
//   } catch (e) {
//     console.error("documentDereferencer frame failed on: " + iri);
//   }
//   return undefined;
// };

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  const resolution = await documentResolver(iri);
  if (resolution?.documentUrl === iri) {
    return resolution;
  }

  if (resolution && iri.startsWith(resolution?.documentUrl)) {
    return { ...resolution, documentUrl: iri };
    // const dereference = await documentDereferencer(resolution?.document, iri);
    // if (dereference?.document) {
    //   return dereference;
    // }
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
