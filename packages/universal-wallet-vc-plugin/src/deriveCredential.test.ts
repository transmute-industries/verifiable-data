import * as fixtures from "@transmute/universal-wallet-test-vectors";

import { case0 as vc } from "./__fixtures__/verifiableCredentials";
import { case0 as frame } from "./__fixtures__/frames";

import {
  BbsBlsSignatureProof2020,
  deriveProof,
} from "@mattrglobal/jsonld-signatures-bbs";

import { pluginFactory } from "./index";

it("should deriveCredential", async () => {
  const plugin = pluginFactory.build();
  const suite = new BbsBlsSignatureProof2020();
  const vc2 = await plugin.deriveCredential({
    verifiableCredential: vc,
    frame: frame,
    options: {
      suite,
      deriveProof,
      documentLoader: (iri: string) => {
        return fixtures.documentLoader(iri);
      },
    },
  });
  expect(vc2.proof.type).toBe("BbsBlsSignatureProof2020");
});
