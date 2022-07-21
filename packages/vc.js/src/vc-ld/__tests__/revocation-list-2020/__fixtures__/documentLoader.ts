import { contexts, revocationContexts } from "./contexts";
import controller from "./controller.json";
import controller2 from "./controller2.json";
import controller3 from "./controller3.json";
import revocationList from "./revocationList.json";

import signedRevocationList2020 from "./signed-revocation-list-2020.json";

import revocationListCredential from "./revocationListCredential.json";
const contextResolver = async (iri: string) => {
  if (revocationContexts[iri]) {
    return { document: contexts[iri] };
  }

  if (
    iri ===
    "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
  ) {
    return {
      document: {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/jws-2020/v1"
        ],
        id: "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
        verificationMethod: [
          {
            id:
              "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
            type: "JsonWebKey2020",
            controller:
              "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
            publicKeyJwk: {
              kty: "OKP",
              crv: "Ed25519",
              x: "DJlj5uNt8eX7LVaabGlSYdzrXjhzjmrlSY35RNd9GmY"
            }
          },
          {
            id:
              "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6LShh513ABHh6V4JhAjuhcQCXGethoWrxcWRgfDfbhkJZfS",
            type: "JsonWebKey2020",
            controller:
              "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
            publicKeyJwk: {
              kty: "OKP",
              crv: "X25519",
              x: "WWC7tPmiV4NK5Z0NDgKuqJCGWxo2yb6GBjk2uL60dA0"
            }
          }
        ],
        assertionMethod: [
          "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
        ],
        authentication: [
          "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
        ],
        capabilityInvocation: [
          "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
        ],
        capabilityDelegation: [
          "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
        ],
        keyAgreement: [
          "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6LShh513ABHh6V4JhAjuhcQCXGethoWrxcWRgfDfbhkJZfS"
        ]
      }
    };
  }

  if (
    iri ===
    "http://localhost:8080/credentials/489ccb71-9352-44f8-ba4e-a8b6f03c44a0"
  ) {
    return {
      document: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/vc-revocation-list-2020/v1"
        ],
        id:
          "http://localhost:8080/credentials/489ccb71-9352-44f8-ba4e-a8b6f03c44a0",
        type: ["VerifiableCredential", "RevocationList2020Credential"],
        credentialSubject: {
          id:
            "http://localhost:8080/credentials/489ccb71-9352-44f8-ba4e-a8b6f03c44a0#list",
          type: "RevocationList2020",
          encodedList:
            "H4sIAAAAAAAAA-3BIQEAAAACIP1_2hcmoAEAAAAAAAAAAAAAAPgbF0EzbtQwAAA"
        },
        issuer: {
          id: "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF"
        },
        issuanceDate: "2022-07-21T15:46:56.274Z",
        proof: {
          type: "Ed25519Signature2018",
          created: "2022-07-21T16:58:08Z",
          verificationMethod:
            "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
          proofPurpose: "assertionMethod",
          jws:
            "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..QzqJzzT4UFSfKJRDC22c6kRAg-H56dRQkJLIro0JBpWXhly1WaG4DVYqOtXN04VzJHFoyeC-nJgioOJmpApoDA"
        }
      }
    };
  }

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

  if (
    iri === "https://w3c-ccg.github.io/vc-http-api/fixtures/revocationList.json"
  ) {
    return {
      documentUrl: iri,
      document: revocationList
    };
  }
  if (
    iri.startsWith("did:key:z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3")
  ) {
    return {
      documentUrl: iri,
      document: controller2
    };
  }

  if (iri === "https://example.com/status/1") {
    return {
      documentUrl: iri,
      document: revocationListCredential
    };
  }
  if (iri === "https://example.com/status/2") {
    return {
      documentUrl: iri,
      document: signedRevocationList2020
    };
  }

  if (
    iri.startsWith("did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4")
  ) {
    return {
      documentUrl: iri,
      document: controller3
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
