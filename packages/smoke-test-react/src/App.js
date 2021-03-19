import React from "react";

import WebCryptoKeyPair from "./packages/web-crypto-key-pair";
import UniversalWallet from "./packages/universal-wallet";

function App() {
  return (
    <div className="App">
      <WebCryptoKeyPair />
      <UniversalWallet />
    </div>
  );
}

export default App;
