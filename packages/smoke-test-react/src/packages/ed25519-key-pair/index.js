import * as ed25519 from "@transmute/ed25519-key-pair";
import React from "react";

import { credentialHelper } from "../../services/credentialHelper";

export const Ed25519KeyPairTest = () => {
  const [state, setState] = React.useState({ name: "ed25519" });

  React.useEffect(() => {
    (async () => {
      const k = await ed25519.Ed25519KeyPair.generate({
        secureRandom: () => {
          return Buffer.from(
            "9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c",
            "hex"
          );
        },
      });

      const k1 = await k.export({
        type: "Ed25519VerificationKey2018",
        privateKey: true,
      });

      const k2 = await k.export({
        type: "JsonWebKey2020",
        privateKey: true,
      });

      const result = await credentialHelper(k2);

      setState({
        ...state,
        k1,
        k2,
        k2Vc: result,
      });
    })();
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
