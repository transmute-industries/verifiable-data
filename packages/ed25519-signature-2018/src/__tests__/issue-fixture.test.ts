import { documentLoader } from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";
import { Ed25519KeyPair } from "@transmute/did-key-ed25519";

const useNew = false;

const KeyPair = useNew ? EdDsaEd25519KeyPair : Ed25519KeyPair;

it("can verify a fixture", async () => {
  const vc = await vcjs.ld.issue({
    credential: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "http://example.gov/credentials/3732",
      type: ["VerifiableCredential"],
      issuer: {
        id: "did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4",
      },
      issuanceDate: "2021-06-19T18:53:11Z",
      credentialSubject: { id: "did:example:ebfeb1f712ebc6f1c276e12ec21" },
    },
    suite: new Ed25519Signature2018({
      key: await KeyPair.from({
        id:
          "did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4#z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4",
        type: "JsonWebKey2020",
        controller: "did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4",
        publicKeyJwk: {
          crv: "Ed25519",
          x: "TQY0tCyM0wMZhJbDQ9B-IoZXWN9hS8bCHkpwVXlVves",
          kty: "OKP",
        },
        privateKeyJwk: {
          crv: "Ed25519",
          d: "XbVr_jPdbQXCoH9hvO1YbSkH7f-FfVl90hH8MKYW44I",
          x: "TQY0tCyM0wMZhJbDQ9B-IoZXWN9hS8bCHkpwVXlVves",
          kty: "OKP",
        },
      }),
      date: "2021-03-01T01:16:12.860Z",
    }),
    documentLoader: (iri: string) => {
      return documentLoader(iri);
    },
  });
  console.log(JSON.stringify(vc));
  expect(vc).toEqual({
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "http://example.gov/credentials/3732",
    type: ["VerifiableCredential"],
    issuer: {
      id: "did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4",
    },
    issuanceDate: "2021-06-19T18:53:11Z",
    credentialSubject: { id: "did:example:ebfeb1f712ebc6f1c276e12ec21" },
    proof: {
      type: "Ed25519Signature2018",
      created: "2021-03-01T01:16:12.860Z",
      jws:
        "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..7rIa_dnXvckcCvrZvpCeWnIj49b2uQ0SBe4epsKiIMJQzxQWW66uO0Jrnp_m_2mzPhzLVV6YujOCdxQh5mBeBw",
      proofPurpose: "assertionMethod",
      verificationMethod:
        "did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4#z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4",
    },
  });
});
