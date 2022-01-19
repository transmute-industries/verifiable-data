import * as web from "@transmute/web-crypto-key-pair";
import React from "react";

import { credentialHelper } from "../../services/credentialHelper";

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

      const result = await credentialHelper(k1);
      setState({ ...state, k1, k1Vc: result });
    })();
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
