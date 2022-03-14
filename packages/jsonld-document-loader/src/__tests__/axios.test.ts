// import axios from "axios";

import { documentLoaderFactory, Url } from "..";

const context = {
  "@context": {
    "@version": 1.1,
    "@vocab": "https://w3id.org/rebase#undefined-term",
    id: "@id",
    type: "@type",
    sameAs: "https://schema.org/sameAs",
    GitHubVerification: {
      "@id": "https://w3id.org/rebase#GitHubVerification",
      "@context": {}
    },
    GithubVerificationMessage: {
      "@id": "https://w3id.org/rebase#GitHubVerificationMessage",
      "@context": {
        handle: {
          "@id": "https://schema.org/name"
        },
        gistVersion: {
          "@id": "https://schema.org/version"
        },
        gistId: {
          "@id": "https://schema.org/url"
        },
        timestamp: {
          "@id": "https://schema.org/DateTime"
        }
      }
    }
  }
};

const documentLoader = documentLoaderFactory.build({
  "https://w3id.org/rebase/v1": async (_iri: Url) => {
    // const { data } = await axios.get(iri);
    // return data;
    return context;
  }
});

describe("can resolve", () => {
  it("over network", async () => {
    const result0 = await documentLoader("https://w3id.org/rebase/v1", {
      accept: "application/json"
    });
    expect(result0.document["@context"]["@vocab"]).toBe(
      "https://w3id.org/rebase#undefined-term"
    );
  });
});
