export default () => ({
  verified: true,
  results: [
    {
      proof: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/vc-revocation-list-2020/v1"
        ],
        type: "Ed25519Signature2018",
        created: "2021-10-31T19:14:41Z",
        verificationMethod:
          "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        proofPurpose: "assertionMethod",
        jws:
          "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..zH7YvO8ihoDO4NWgzPu4kvvdQJjWAPOUlz7D1551U4uSMqOGjRmEGef6NSbIdxqCy5FxXwOD49KyPRU66LpwBA"
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
