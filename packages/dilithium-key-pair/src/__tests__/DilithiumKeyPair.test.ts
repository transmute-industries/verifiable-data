import { DilithiumKeyPair } from "../index";

it("generate", async () => {
  const k = await DilithiumKeyPair.generate();
  expect(k.id).toBeDefined();
  expect(k.type).toBeDefined();
  expect(k.controller).toBeDefined();
  expect(k.publicKeyJwk).toBeDefined();
  expect(k.privateKeyJwk).toBeDefined();
});

it("sign and verify", async () => {
  const k = await DilithiumKeyPair.generate();
  const signer = k.signer();
  const verifier = k.verifier();
  const message = Buffer.from("hello world");
  const sig = await signer.sign({ data: message });
  const ver = await verifier.verify({ data: message, signature: sig });
  expect(ver).toBe(true);
});
