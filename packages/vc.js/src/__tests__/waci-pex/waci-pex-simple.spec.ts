import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  Bls12381G2Key2020,
  Bls12381G2KeyPair,
} from "@transmute/bbs-bls12381-signature-2020";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

describe("waci-pex", () => {
  it("can create credential", async () => {
    const key = fixtures.keys.bls as Bls12381G2Key2020;
    const result = await verifiable.credential.create({
      credential: {
        ...fixtures.credentials.simple,
        issuer: { id: fixtures.keys.bls.controller }, // make sure issuer is set correctly
      },
      format: ["vc"],
      documentLoader: fixtures.documentLoader,
      suite: new BbsBlsSignature2020({
        key: await Bls12381G2KeyPair.from(key),
        date: fixtures.credentials.simple.issuanceDate,
      }) as any,
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0].proof.type).toBe("BbsBlsSignature2020");
  });

  it("can derive credential", async () => {
    const result = await verifiable.credential.derive({
      credential: fixtures.verifiableCredentials.simple,
      frame: fixtures.frames.simple,
      documentLoader: fixtures.documentLoader,
      suite: new BbsBlsSignatureProof2020(),
    });
    expect(result.items.length).toBe(1);
    expect(result.items[0].proof.type).toBe("BbsBlsSignatureProof2020");
  });

  it("can verify derived credential", async () => {
    const result = await verifiable.credential.verify({
      credential: fixtures.derivedCredentials.simple,
      documentLoader: fixtures.documentLoader,
      suite: new BbsBlsSignatureProof2020(),
    });
    expect(result.verified).toBeTruthy();
  });
});
