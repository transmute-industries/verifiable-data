import { verifiable } from "../../..";
import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";

import { checkStatus } from "@transmute/vc-status-rl-2020";

import { documentLoader, revokedCredential } from "./__fixtures__";

it('verifier can verifer credential with "credentialStatus"', async () => {
  const result = await verifiable.credential.verify({
    credential: revokedCredential,
    documentLoader,
    suite: [new Ed25519Signature2018()],
    checkStatus // required
  });
  expect(result.verified).toBe(false);
  expect(result.error[0].statusResult.verified).toBe(false);
});
