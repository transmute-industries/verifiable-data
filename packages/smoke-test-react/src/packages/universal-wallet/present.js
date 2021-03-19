import { Ed25519KeyPair } from "@transmute/did-key-ed25519";
import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
import { documentLoader } from "@transmute/universal-wallet-test-vectors";

export const present = async (wallet) => {
  const k = wallet.contents.find((k) => {
    return (
      k.id ===
      "did:key:z6MkwJSaEMnE4u6LiqrZV1BJHSkc9x8S4mTm3ArNL1m19BZR#z6MkwJSaEMnE4u6LiqrZV1BJHSkc9x8S4mTm3ArNL1m19BZR"
    );
  });

  const key = await Ed25519KeyPair.from(k);
  const suite = new Ed25519Signature2018({
    key,
    date: "2020-03-10T04:24:12.164Z",
  });
  const verifiableCredential = wallet.contents.filter((c) => {
    return c.type.includes("VerifiableCredential");
  });
  const vp = await wallet.createVerifiablePresentation({
    verifiableCredential,
    options: {
      holder: k.controller,
      domain: "wallet.example",
      challenge: "123",
      suite,
      documentLoader,
    },
  });
  return [vp];
};
