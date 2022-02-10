import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";

import { FixtureWalletFactory } from "./walletFactory";

import { documentLoader } from "./documentLoader";

export const makeVc = async (wallet: FixtureWalletFactory, type: string) => {
  const signingKey = wallet.contents[0];
  const key = await Ed25519VerificationKey2018.from(wallet.contents[0]);
  const suite = new Ed25519Signature2018({
    key,
    date: "2020-03-10T04:24:12.164Z"
  });
  return wallet.issue({
    credential: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          [type]: "https://example.com/" + type
        }
      ],
      id: "https://example.com/credentials/123",
      type: ["VerifiableCredential", type],
      issuer: signingKey.controller,
      issuanceDate: "2019-12-03T12:19:52Z",
      credentialSubject: {
        id: "did:example:456"
      }
    },
    options: {
      documentLoader,
      suite: suite
    }
  });
};
