export const checkStatus1 = () => ({
  verified: true,
  results: [
    {
      proof: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/jws-2020/v1",
          "https://w3id.org/vc-revocation-list-2020/v1"
        ],
        type: "JsonWebSignature2020",
        created: "2010-01-01T19:23:24Z",
        verificationMethod:
          "did:key:z6MkhRZ7XMcydYWTYGQrVxKXaG9Bpd3LrbA345QGWNMaSxeE#z6MkhRZ7XMcydYWTYGQrVxKXaG9Bpd3LrbA345QGWNMaSxeE",
        proofPurpose: "assertionMethod",
        jws:
          "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..gz5cG7HbHtyb9x_bakUUQcZ-CDK2kq663HBPmSnIzvK0eY7jUJArrwNcMg1olMzUmZZ-WrJrnWJJS-kyaM8_Bw"
      },
      verified: true,
      purposeResult: {
        valid: true
      }
    }
  ],
  statusResult: {
    verified: true
  }
});

export const checkStatus2 = (): Promise<any> =>
  ({
    verified: false,
    results: [
      {
        proof: {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/traceability/v1",
            "https://w3id.org/vc-revocation-list-2020/v1"
          ],
          type: "Ed25519Signature2018",
          created: "2022-07-21T15:46:57Z",
          verificationMethod:
            "did:key:z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF#z6MkfJSbaRjStEZWd8KiV2zUSfnEXnFX5iviaLe1ArMTkNXF",
          proofPurpose: "assertionMethod",
          jws:
            "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..pmEwKqyHCaLihLUzC-3NnPxRtqbSm62Zk4I-B7yYrha5fMOMpThOXPCugkA0A90JlvKYfklB3nj1uKJ7Jyt6BA"
        },
        verified: true,
        purposeResult: {
          valid: true
        }
      }
    ],
    statusResult: {
      verified: false
    }
  } as any);
