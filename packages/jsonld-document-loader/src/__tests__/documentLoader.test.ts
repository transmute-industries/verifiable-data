import { documentLoaderFactory, Did, DidUrl } from "..";

it("can build a multi content documentLoader with safe types", async () => {
  const documentLoader: any = documentLoaderFactory.build({
    // static contexts built at compile time
    "https://w3id.org/traceability/v1": {
      "@context": {
        "@version": 1.1,
        "@vocab": "https://w3id.org/traceability/#undefined-term-"
      }
    },
    "did:example:dev:": async (didUrl: DidUrl) => {
      return {
        id: didUrl,
        cool: 123
      };
    },
    "did:example:": async (did: Did) => {
      return { id: did };
    }
  });
  const result0 = await documentLoader("https://w3id.org/traceability/v1");
  expect(result0.document["@context"]).toBeDefined();

  const result1 = await documentLoader("did:example:123");
  expect(result1.document.id).toBe("did:example:123");

  const result2 = await documentLoader("did:example:dev:123");
  expect(result2.document.cool).toBe(123);
});
