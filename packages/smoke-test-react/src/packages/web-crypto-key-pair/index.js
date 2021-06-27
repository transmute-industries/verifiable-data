import React from "react";

import * as web from "@transmute/web-crypto-key-pair";

function App() {
  const [state, setState] = React.useState({ kp: {} });
  React.useEffect(() => {
    (async () => {
      const key = await web.KeyPair.generate({ kty: "EC", crvOrSize: "P-384" });
      const signer = await key.signer();
      const verifier = await key.verifier();
      const signature = await signer.sign({
        data: Buffer.from("hello"),
      });
      const verified = await verifier.verify({
        data: Buffer.from("hello"),
        signature,
      });
      const local = await key.export({
        type: "JsonWebKey2020",
        privateKey: true,
      });
      const remote = await key.export({
        type: "JsonWebKey2020",
        privateKey: false,
      });
      const bits = await key.deriveBits(remote);
      setState({
        key: local,
        signature,
        verified,
        bits: Buffer.from(bits).toString("base64"),
      });
    })();
  }, []);
  return (
    <div className="Package">
      <h4>@transmute/web-crypto-key-pair</h4>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
