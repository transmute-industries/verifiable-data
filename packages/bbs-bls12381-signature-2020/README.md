# @transmute/bbs-bls12381-signature-2020

```
npm i @transmute/bbs-bls12381-signature-2020 --save
```

- [Read the Spec](https://w3id.org/security/suites/bls12381-2020)

## Usage

```ts
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
} from "@transmute/bbs-bls12381-signature-2020";

import { documentLoader } from "path/somewhere";
import { verifiable } from "@transmute/vc.js";

const key = await Bls12381G2KeyPair.from({
  id: "did:example:123#key-0",
  type: "JsonWebKey2020",
  controller: "did:example:123",
  publicKeyJwk: {
    kty: "EC",
    crv: "BLS12381_G2",
    x:
      "ixPeWzjhGlmfoRTxKnUdDDpuiYXix9Yoy68Chb1r47J4-wxqPvFxVIgQN-8qQEgACterr23Ogo3XmcHYgcdnlPsfArPriZzrUv4jpstRt2Q6UmYoGqOWXyIBnFtCBad6",
  },
  privateKeyJwk: {
    kty: "EC",
    crv: "BLS12381_G2",
    x:
      "ixPeWzjhGlmfoRTxKnUdDDpuiYXix9Yoy68Chb1r47J4-wxqPvFxVIgQN-8qQEgACterr23Ogo3XmcHYgcdnlPsfArPriZzrUv4jpstRt2Q6UmYoGqOWXyIBnFtCBad6",
    d: "Jh-q1-B5mj7wMQQu44skVzPy0wWPTRtBNiXY8AAs0zc",
  },
});

const result = await verifiable.credential.create({
  credential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/bls12381-2020/v1",
      {
        alsoKnownAs: "https://www.w3.org/ns/activitystreams#alsoKnownAs",
      },
    ],
    id: "http://example.edu/credentials/3732",
    type: ["VerifiableCredential"],
    issuer: {
      id:
        "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P",
    },
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      alsoKnownAs: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    },
  },
  format: ["vc"],
  documentLoader: documentLoader,
  suite: new BbsBlsSignature2020({
    key,
  }),
});

const result1 = await verifiable.credential.derive({
  credential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/bls12381-2020/v1",
      {
        alsoKnownAs: "https://www.w3.org/ns/activitystreams#alsoKnownAs",
      },
    ],
    id: "http://example.edu/credentials/3732",
    type: ["VerifiableCredential"],
    issuer: {
      id:
        "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P",
    },
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      alsoKnownAs: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    },
    proof: {
      type: "BbsBlsSignature2020",
      created: "2010-01-01T19:23:24Z",
      verificationMethod:
        "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P#zUC75GQp8DFusgffgEyvGiSoXL7UztujwGyjHXdJP9PcAz74dgGCrFSNyhKFPCsuxXeKLko5H19M2sL8RA45f7SMc2pKx3uvfn1KSB7nSh7GqX59kxWksVTSicghfFLGZBNK9ah",
      proofPurpose: "assertionMethod",
      proofValue:
        "iqPux4PDWBuSpRc3mqKTJJetr0zes3g9pDiQZbL8oeV/od+PLzeVCqGSZc657yu2T0AHSxEzuZcqOD8zZ2nAixphk7rSxyYkOzg5HpWsKxYP/89qtR30JG5YOYESilRb6CByt2Idi5Hj3R0uA5YsJw==",
    },
  },
  frame: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/bls12381-2020/v1",
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      alsoKnownAs: { id: {} },
    },
  },
  format: ["vc"],
  documentLoader: documentLoader,
  suite: new BbsBlsSignatureProof2020(BbsBlsSignatureProof2020),
});

const result2 = await verifiable.credential.verify({
  credential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/bls12381-2020/v1",
      {
        alsoKnownAs: "https://www.w3.org/ns/activitystreams#alsoKnownAs",
      },
    ],
    id: "http://example.edu/credentials/3732",
    type: "VerifiableCredential",
    credentialSubject: {
      id: "urn:bnid:_:c14n0",
      alsoKnownAs: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    },
    issuanceDate: "2010-01-01T19:23:24Z",
    issuer:
      "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P",
    proof: {
      type: "BbsBlsSignatureProof2020",
      nonce:
        "XZZvSvXvyFc6M4SzqiT1XF7sI2b9bqsQtIMS+uTg2aiYdbidB0bqQw+ohg/NiBQSytA=",
      proofValue:
        "AAkB/6fHcs17gvQ7qh5lMqosFkDO7G1LdcPd+b31fw1fRSQYY2PdKZwWRMd065Z3HL9AfLKMvYQ+m1way8xIJLMI80ddk+EvZujnUb/V+mdjYsL5H1xMhMO7Iyo7vJ1BKOTFY6o3ZXoDFp8f2VjXlKMY6eyAaGas2mZNsj+lGYJLpE3CT86lvHe47O8eN0rzNX8KtAAAAHSNpcl5mHy2o8Kn1mwHe1kf2i+C6mrjG1xkCWzv8IQFlaXf8TW9j3y8NxJPvoCdNIYAAAACHnUSRX9dZjcnsSu1S9PuljAM9Y/hl6lk5xFH4+YCNLEMBQjhHrWy2Mb4fjF4k6AjPZKTLkP0Ma4HmvUTTi/TtKgV6nsskkCz8eha5bJYt88hQgmdlMxwkfsTXaMg3ppJx0CYUmTX8rXAo+N5Uv3SpQAAAAJr3RPSdM8piRpxon6xn8rwHA6I7Ii7aZg5ghAt0se8Sl9TNmknAyNInV0tzkVwkYZwYLB5/kx5gf45aPkDKopm",
      verificationMethod:
        "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P#zUC75GQp8DFusgffgEyvGiSoXL7UztujwGyjHXdJP9PcAz74dgGCrFSNyhKFPCsuxXeKLko5H19M2sL8RA45f7SMc2pKx3uvfn1KSB7nSh7GqX59kxWksVTSicghfFLGZBNK9ah",
      proofPurpose: "assertionMethod",
      created: "2010-01-01T19:23:24Z",
    },
  },
  format: ["vc"],
  documentLoader: (iri: string) => {
    if (iri.startsWith("did:example:345")) {
      return {
        documentUrl: iri,
        document: {
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/bls12381-2020/v1",
          ],
          id: "did:example:345",
          assertionMethod: [
            {
              id: "did:example:345#key-1",
              type: "Bls12381G2Key2020",
              controller: "did:example:345",
              publicKeyBase58:
                "24urEcrYHvx6eReCPRdvTLHUictArUTQpENSGwTRB1KosFNKLdN9cDVvbX5KMWnR2omGpSeJuT2q9uUGrasKWqht9YyMSd5aukprRGVFFNYrzxgCd137PwsdSXhbxxWoCmga",
            },
          ],
        },
      };
    }
    return documentLoader(iri);
  },
  suite: [new BbsBlsSignatureProof2020()],
});
```

## About

This module is based on the original [here](https://github.com/mattrglobal/jsonld-signatures-bbs).

It was modified to simplify JSON-LD contexts, and eliminate dependency inherentence.
