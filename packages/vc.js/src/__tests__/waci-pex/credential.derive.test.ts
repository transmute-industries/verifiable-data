import { BbsBlsSignatureProof2020 } from "@transmute/bbs-bls12381-signature-2020";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

it("can derive credentials", async () => {
  const result = await verifiable.credential.derive({
    credential: fixtures.verifiableCredential,
    frame: fixtures.frame,
    format: ["vc"],
    documentLoader: (iri: string) => {
      if (iri.startsWith("did:key:z5TcDVRemCWTd6qwxxhFeYD")) {
        return {
          document: {
            "@context": [
              "https://www.w3.org/ns/did/v1",
              "https://w3id.org/security/suites/bls12381-2020/v1",
            ],
            id:
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9",
            verificationMethod: [
              {
                id:
                  "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#z3tEFTbaJiYRxLmhHhPXT69nu1PB79SvQsgjAaQhbbB5F7nz5qsZQaqJYgtE3Un6hkfAbV",
                type: "Bls12381G1Key2020",
                controller:
                  "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9",
                publicKeyBase58:
                  "6ZF3SDiWwZTqMzoD7aMQtgHU5cPBt4erCdfEzGyE5jHqf7jAMYzG49C2ifcYFi33FZ",
              },
              {
                id:
                  "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb",
                type: "Bls12381G2Key2020",
                controller:
                  "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9",
                publicKeyBase58:
                  "22PvmhXKgESXsME2gaRsHKCVHGhkuSxQegU3DKHFNvKztu6CruR4uKW7cv6QHmCAGUsPdD7LEr671zitCBKVzCRCtB1nMTbce2THRXFWmNM3v8dBziVUBAuHeYGKWtTrQW6H",
              },
            ],
            assertionMethod: [
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#z3tEFTbaJiYRxLmhHhPXT69nu1PB79SvQsgjAaQhbbB5F7nz5qsZQaqJYgtE3Un6hkfAbV",
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb",
            ],
            authentication: [
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#z3tEFTbaJiYRxLmhHhPXT69nu1PB79SvQsgjAaQhbbB5F7nz5qsZQaqJYgtE3Un6hkfAbV",
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb",
            ],
            capabilityInvocation: [
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#z3tEFTbaJiYRxLmhHhPXT69nu1PB79SvQsgjAaQhbbB5F7nz5qsZQaqJYgtE3Un6hkfAbV",
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb",
            ],
            capabilityDelegation: [
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#z3tEFTbaJiYRxLmhHhPXT69nu1PB79SvQsgjAaQhbbB5F7nz5qsZQaqJYgtE3Un6hkfAbV",
              "did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb",
            ],
          },
        } as any;
      }
      return fixtures.documentLoader(iri);
    },
    suite: new BbsBlsSignatureProof2020(),
  });
  expect(result.items[0].proof.type).toBe("BbsBlsSignatureProof2020");
});
