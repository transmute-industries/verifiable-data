export const checkStatus1 = () => ({
  verified: true,
  results: [
    {
      proof: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/citizenship/v1",
          "https://w3id.org/vc-revocation-list-2020/v1"
        ],
        type: "Ed25519Signature2018",
        created: "2021-02-16T04:32:29Z",
        jws:
          "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nFXiF3D2p-Pt6K75si3Gg8ZOP7rvbEYSP3kkXUj-d5TbrGWTfxjE6u4rb89mSRvmkxsldZH1RSdxLbAM-aP6Dw",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "did:key:z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3#z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3"
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

export const checkStatus2 = () => ({
  verified: false,
  results: [
    {
      proof: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/citizenship/v1",
          "https://w3id.org/vc-revocation-list-2020/v1"
        ],
        type: "Ed25519Signature2018",
        created: "2021-02-18T04:19:23Z",
        jws:
          "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..tM_94zQxF5LwVqaW1Q4iGnkEDyn9Mbg7A6l3d1sVd9-Yt6AOVvAILqYKWuGiXIOy64Eudw_y0UMJ4I0XpEeUAw",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "did:key:z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3#z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3"
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
});
