import * as web from "@transmute/web-crypto-key-pair";
import React from "react";

export const WebCryptoKeyPairTest = () => {
  const [state, setState] = React.useState({ name: "web" });

  React.useEffect(() => {
    (async () => {
      const k = await web.WebCryptoKey.generate({
        kty: "EC",
        crvOrSize: "P-384",
      });

      const k1 = await k.export({
        type: "JsonWebKey2020",
        privateKey: true,
      });

      setState({ ...state, k1 });
    })();
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
