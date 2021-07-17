import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} from "@mattrglobal/jsonld-signatures-bbs";
import vc from "@digitalbazaar/vc";
import * as fixtures from "./__fixtures__";

// const expectProofsToBeEqual = (a: any, b: any) => {
//   // because these signatures are not deterministic,
//   // we cannot compare the full proof
//   // so we delete the parts that change
//   delete a.proof.created;
//   delete a.proof.proofValue;
//   delete a.proof.nonce;
//   const unstable: any = JSON.parse(JSON.stringify(b));
//   delete unstable.proof.created;
//   delete unstable.proof.proofValue;
//   delete unstable.proof.nonce;
//   expect(a).toEqual(unstable);
// };

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(fixtures.key as any);
  suite = new BbsBlsSignature2020({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("issue verifiable credential", async () => {
  expect.assertions(1);
  try {
    const verifiableCredential = await vc.issue({
      credential: { ...fixtures.credential, issuer: { id: key.controller } },
      suite
    });
    console.log(verifiableCredential);
    // expect(verifiableCredential).toEqual(fixtures.verifiableCredential);
  } catch (e) {
    // blocked by https://github.com/digitalbazaar/jsonld-signatures/issues/143
    expect(e.message).toBe("suite.ensureSuiteContext is not a function");
  }
});
// blocked by https://github.com/digitalbazaar/jsonld-signatures/issues/143
// it("verify verifiable credential", async () => {
//   const res = await vc.verifyCredential({
//     credential: fixtures.verifiableCredential,
//     suite: new Ed25519Signature2018(),
//     documentLoader: fixtures.documentLoader,
//   });
//   expect(res.verified).toBe(true);
// });

// it("present verifiable credential", async () => {
//   const verifiablePresentation = await vc.signPresentation({
//     presentation: {
//       "@context": fixtures.verifiableCredential["@context"],
//       type: ["VerifiablePresentation"],
//       verifiableCredential: [fixtures.verifiableCredential],
//     },
//     challenge: "123",
//     suite,
//   });
//   expect(verifiablePresentation).toEqual(fixtures.verifiablePresentation);
// });

// it("verify presentation", async () => {
//   const res = await vc.verify({
//     presentation: fixtures.verifiablePresentation,
//     challenge: "123",
//     suite,
//     documentLoader: fixtures.documentLoader,
//   });
//   expect(res.verified).toBe(true);
// });
