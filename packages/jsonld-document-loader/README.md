#### JSON-LD Document Loader

```
npm i @transmute/jsonld-document-loader --save
```

## Usage

### With Static Context

```ts
const documentLoader = documentLoaderFactory.build({
  ["https://w3id.org/traceability/v1"]: {
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
        "@type": "@id",
      },
    },
  },
});
```

### With Dynamic Context

```ts
const documentLoader = documentLoaderFactory.build({
  ["https://w3id.org/rebase/v1"]: async (iri: Url) => {
    const { data } = await axios.get(iri);
    return data;
  },
});
```

### With Remove DID Resolver

```ts
const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (didUrl: DidUrl) => {
    const endpoint = `https://api.did.actor/api/identifiers/${did}`;
    const { data } = await axios.get(endpoint);
    return data.didDocument;
  },
});
```
