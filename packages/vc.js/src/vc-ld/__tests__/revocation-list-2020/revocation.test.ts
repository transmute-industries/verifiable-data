import { verifiable } from "../../..";
import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";

import { checkStatus2 as checkStatus } from "./__fixtures__/checkStatus";

import { documentLoader, revokedCredential } from "./__fixtures__";

it('verifier can verifer credential with "credentialStatus"', async () => {
  const result = await verifiable.credential.verify({
    credential: revokedCredential,
    documentLoader,
    suite: [new Ed25519Signature2018()],
    checkStatus // required
  });
  expect(result.verified).toBe(false);
  expect(result.error[0]).toBe(
    "This credential contains invalid JSON-LD allowing it to be mutable."
  );
});
