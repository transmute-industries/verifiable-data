import { contextFactory } from "../";

it("can build a context resolver with safe types", async () => {
  const resolver = contextFactory.build({
    // static contexts built at compile time
    "https://w3id.org/traceability/v1": {
      "@context": {
        "@version": 1.1,
        "@vocab": "https://w3id.org/traceability/#undefinedTerm",
        id: "@id",
        type: "@type",
        name: "https://schema.org/name",
        description: "https://schema.org/description",
        identifier: "https://schema.org/identifier",
        image: {
          "@id": "https://schema.org/image",
          "@type": "@id"
        }
      }
    },
    // dynamic contexts loaded at runtime
    http: async (_iri: string) => {
      // here you would await a network resolution
      return {
        "@context": {
          "@version": 1.1,
          "@vocab": "https://example.com"
        }
      };
    }
  });
  const resolution = await resolver.load("https://w3id.org/traceability/v1");
  expect(resolution["@context"]).toBeDefined();
  const resolution2: any = await resolver.load("https://example.com");
  expect(resolution2["@context"]["@vocab"]).toBe("https://example.com");
});
