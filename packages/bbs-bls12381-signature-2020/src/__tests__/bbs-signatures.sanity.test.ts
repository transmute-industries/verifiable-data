import {
  blsSign,
  blsVerify,
  blsCreateProof,
  blsVerifyProof
} from "@mattrglobal/bbs-signatures";

import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";

import { keys } from "../__fixtures__";

const messages = [
  Uint8Array.from(Buffer.from("1")),
  Uint8Array.from(Buffer.from("2")),
  Uint8Array.from(Buffer.from("3"))
];

const nonce = Uint8Array.from(Buffer.from("nonce"));

let k: Bls12381G2KeyPair;
let signature: Uint8Array;
let proof: Uint8Array;

it("can parse jwks", async () => {
  k = await Bls12381G2KeyPair.from(keys.key0 as any);
  expect(k.publicKey).toBeInstanceOf(Uint8Array);
  expect(k.privateKey).toBeInstanceOf(Uint8Array);
});

it("can sign", async () => {
  signature = await blsSign({
    messages,
    keyPair: {
      secretKey: k.privateKey,
      publicKey: k.publicKey
    }
  });
  expect(signature).toBeInstanceOf(Uint8Array);
});

it("can verify", async () => {
  const result = await blsVerify({
    messages,
    signature,
    publicKey: k.publicKey
  });
  expect(result.verified).toBe(true);
});

it("can create proof", async () => {
  proof = await blsCreateProof({
    signature,
    publicKey: k.publicKey,
    messages,
    nonce,
    revealed: [0]
  });
  expect(proof).toBeInstanceOf(Uint8Array);
});

it("can verify proof", async () => {
  const result = await blsVerifyProof({
    proof,
    publicKey: k.publicKey,
    messages: messages.slice(0, 1),
    nonce
  });
  expect(result.verified).toBe(true);
});
