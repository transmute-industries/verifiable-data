import React from "react";
import { Secp256k1KeyPairTest } from "./packages/secp256k1-key-pair";
import { Bls12381KeyPairTest } from "./packages/bls12381-key-pair";
import { WebCryptoKeyPairTest } from "./packages/web-crypto-key-pair";
function App() {
  return (
    <div className="App">
      <h3> See console.</h3>

      <Secp256k1KeyPairTest />
      <Bls12381KeyPairTest />
      <WebCryptoKeyPairTest />
    </div>
  );
}

export default App;
