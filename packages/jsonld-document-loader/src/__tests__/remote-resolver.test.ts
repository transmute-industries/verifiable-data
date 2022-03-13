// import axios from "axios";

import { documentLoaderFactory, DidUrl, didUrlToDid } from "..";

const resolution = {
  didDocument: {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    id: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
    verificationMethod: [
      {
        id:
          "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        type: "JsonWebKey2020",
        controller: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        publicKeyJwk: {
          kty: "OKP",
          crv: "Ed25519",
          x: "0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU"
        }
      },
      {
        id:
          "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6LSt8Cke1XG6vthTpdek9xx6a5NKz8gEuYPQHJPhRjfREAC",
        type: "JsonWebKey2020",
        controller: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        publicKeyJwk: {
          kty: "OKP",
          crv: "X25519",
          x: "9GXjPGGvmRq9F6Ng5dQQ_s31mfhxrcNZxRGONrmH30k"
        }
      }
    ],
    assertionMethod: [
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    ],
    authentication: [
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    ],
    capabilityInvocation: [
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    ],
    capabilityDelegation: [
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    ],
    keyAgreement: [
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6LSt8Cke1XG6vthTpdek9xx6a5NKz8gEuYPQHJPhRjfREAC"
    ]
  },
  didResolutionMetadata: {
    didUrl: {
      did: "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
      methodName: "key",
      methodSpecificId: "z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    }
  },
  didDocumentMetadata: {}
};

const documentLoader = documentLoaderFactory.build({
  "did:key": async (didUrl: DidUrl) => {
    // const endpoint = `https://api.did.actor/api/identifiers/${did}`;
    // const { data } = await axios.get(endpoint);
    // return data.didDocument;
    expect(didUrlToDid(didUrl)).toBe(resolution.didDocument.id);
    return resolution.didDocument;
  }
});

describe("remote resolver", () => {
  it("resolve", async () => {
    const result0 = await documentLoader(
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
      {
        accept: "application/json"
      }
    );
    expect(result0.document.id).toBe(
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    );
  });

  it("dereference ld+json", async () => {
    const result0 = await documentLoader(
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
      {
        accept: "application/ld+json"
      }
    );
    expect(result0.document.id).toBe(
      "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
    );
    expect(result0.document["@context"]).toBeDefined();
    expect(result0.document.publicKeyJwk).toBeDefined();
  });
});
