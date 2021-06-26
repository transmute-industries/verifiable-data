const knownGood = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "http://example.edu/credentials/3732",
  type: ["VerifiableCredential"],
  issuer: {
    id: "did:key:z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9",
  },
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  },
  proof: {
    type: "Ed25519Signature2018",
    created: "2010-01-01T19:23:24Z",
    verificationMethod:
      "did:key:z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9#z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9",
    proofPurpose: "assertionMethod",
    jws:
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..3Iqy1huBqCLqK1vPlR-o2q3JM-U-2jmoipDrfzwNmoNVRA4lsRpTxD73VLQdre4ObThY-th80X9Qm2OTCW7PDg",
  },
};

import { documentLoader } from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";

const credential = JSON.parse(JSON.stringify(knownGood));

delete credential.proof;

const rawKey = {
  id:
    "did:key:z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9#z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9",
  type: "Ed25519VerificationKey2018",
  controller: "did:key:z6Mkew255FKejm6XPnVHVb96UwEbJEUkrjoBDYzhdKRGQgA9",
  publicKeyBase58: "Um2V15DQDc4HHeap2BFdqgbUfCuSrYpXY5mo3TFVTNm",
  privateKeyBase58:
    "2mjy5khpL2oHxWcb2YgZCixg2GmqWZBNXZAJdtpLBKuVxa3rhYt421ro4b85qR6J52D6h4anuEV7b3Fz3DyPV9Cy",
};

it("base58 issue to fixture", async () => {
  const vc = await vcjs.ld.issue({
    credential: { ...credential },
    suite: new Ed25519Signature2018({
      key: await EdDsaEd25519KeyPair.from(rawKey),
      date: "2010-01-01T19:23:24Z",
    }),
    documentLoader: (iri: string) => {
      return documentLoader(iri);
    },
  });
  expect(vc).toEqual(knownGood);
});

it("jwk issue to fixture", async () => {
  const k = await EdDsaEd25519KeyPair.from(rawKey);
  const kn = await k.export({ type: "JsonWebKey2020", privateKey: true });
  const vc = await vcjs.ld.issue({
    credential: { ...credential },
    suite: new Ed25519Signature2018({
      key: await EdDsaEd25519KeyPair.from(kn),
      date: "2010-01-01T19:23:24Z",
    }),
    documentLoader: (iri: string) => {
      return documentLoader(iri);
    },
  });
  expect(vc).toEqual(knownGood);
});
