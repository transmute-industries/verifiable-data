import { calculateMessageNonce, sha256 } from "..";

it("can produce message nonces from root nonce", () => {
  const m0 = Buffer.from("0");
  const mi = 0;
  const rootNonce = Buffer.from("123", "hex");
  const n0 = calculateMessageNonce(m0, mi, rootNonce, sha256);
  expect(n0.toString("hex")).toBe(
    "7990e13ec55f4578c5df089d3c13438ee75b74726a6a150b49bd902196469a11"
  );
});
