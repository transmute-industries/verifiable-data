import { documentLoaderFactory, didUrlToDid, DidUrl } from "..";

const documentLoader = documentLoaderFactory.build({
  "https://w3id.org/traceability/v1": {
    "@context": {
      "@version": 1.1,
      "@vocab": "https://w3id.org/traceability/#undefined-term-"
    }
  },
  "did:example:": async (didUrl: DidUrl) => {
    const did = didUrlToDid(didUrl);
    const didDocument = {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/jws-2020/v1"
      ],
      id: did,
      verificationMethod: [
        {
          id: did + "/path/primary?query=42#fragment-23",
          publicKeyJwk: {
            kty: "OKP",
            crv: "Ed25519",
            x: "gmajf6HkDCPd4-Y6LbJs_rliC_zPyvAPF9jjpBFSYEQ"
          }
        }
      ]
    };
    return didDocument;
  }
});

const did = "did:example:123";
const didUrl = `${did}/path/primary?query=42#fragment-23`;

describe("can resolve", () => {
  it("json-ld context", async () => {
    const result0 = await documentLoader("https://w3id.org/traceability/v1", {
      accept: "application/json"
    });
    expect(result0.document["@context"]).toBeDefined();
  });

  it("did", async () => {
    const result1 = await documentLoader(did);
    expect(result1.document.id).toBe(did);
  });

  it("did url", async () => {
    const result2 = await documentLoader(didUrl);
    expect(result2.document.id).toBe(didUrl);
    expect(result2.document["@context"]).not.toBeDefined();
  });
  it("did url as ld+json", async () => {
    const result3 = await documentLoader(didUrl, {
      accept: "application/ld+json"
    });
    expect(result3.document.id).toBe(didUrl);
    expect(result3.document["@context"]).toBeDefined();
  });
  it("did url as did+ld+json", async () => {
    const result4 = await documentLoader(didUrl, {
      accept: "application/did+ld+json"
    });
    expect(result4.document.id).toBe(didUrl);
    expect(result4.document["@context"]).toBeDefined();
  });
});
