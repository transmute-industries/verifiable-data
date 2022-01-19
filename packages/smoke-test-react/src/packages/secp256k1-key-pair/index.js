import * as secp256k1 from "@transmute/secp256k1-key-pair";
import React from "react";

import { credentialHelper } from "../../services/credentialHelper";

export const Secp256k1KeyPairTest = () => {
  const [state, setState] = React.useState({ name: "secp256k1" });

  React.useEffect(() => {
    (async () => {
      const k = await secp256k1.Secp256k1KeyPair.generate({
        secureRandom: () => {
          return Buffer.from(
            "9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c",
            "hex"
          );
        },
      });
      const k1 = await k.export({
        type: "EcdsaSecp256k1VerificationKey2019",
        privateKey: true,
      });

      const k2 = await k.export({
        type: "JsonWebKey2020",
        privateKey: true,
      });

      const matchesFixture1 =
        JSON.stringify(k1) ===
        JSON.stringify({
          id: "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme",
          type: "EcdsaSecp256k1VerificationKey2019",
          controller:
            "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme",
          publicKeyBase58: "23o6Sau8NxxzXcgSc3PLcNxrzrZpbLeBn1izfv3jbKhuv",
          privateKeyBase58: "AjA4cyPUbbfW5wr6iZeRbJLhgH3qDt6q6LMkRw36KpxT",
        });

      const matchesFixture2 =
        JSON.stringify(k2) ===
        JSON.stringify({
          id: "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme",
          type: "JsonWebKey2020",
          controller:
            "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme",
          publicKeyJwk: {
            kty: "EC",
            crv: "secp256k1",
            x: "h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0",
            y: "O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE",
          },
          privateKeyJwk: {
            kty: "EC",
            crv: "secp256k1",
            x: "h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0",
            y: "O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE",
            d: "kIXSvvaShqbLtRYjyPolhimUXNVcpwXMTmZwA5aJTgw",
          },
        });

      const result = await credentialHelper(k2);

      setState({
        ...state,
        matchesFixture1,
        matchesFixture2,
        k1,
        k2,
        k2Vc: result,
      });
    })();
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
