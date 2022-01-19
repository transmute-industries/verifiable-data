import React from "react";
import { Ed25519KeyPairTest } from "./packages/ed25519-key-pair";
import { Secp256k1KeyPairTest } from "./packages/secp256k1-key-pair";
import { Bls12381KeyPairTest } from "./packages/bls12381-key-pair";
import { WebCryptoKeyPairTest } from "./packages/web-crypto-key-pair";

function App() {
  return (
    <div className="App">
      <h3> See console.</h3>
      <Ed25519KeyPairTest />
      <Secp256k1KeyPairTest />
      <Bls12381KeyPairTest />
      <WebCryptoKeyPairTest />
    </div>
  );
}

export default App;
