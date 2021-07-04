import * as bls12381 from "@transmute/bls12381-key-pair";
import React from "react";

export const Bls12381KeyPairTest = () => {
  const [state, setState] = React.useState({ name: "bls12381" });

  React.useEffect(() => {
    (async () => {
      const k = await bls12381.Bls12381KeyPairs.generate({
        secureRandom: () => {
          return Buffer.from(
            "9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c",
            "hex"
          );
        },
      });

      const k1 = await k.g2KeyPair.export({
        type: "JsonWebKey2020",
        privateKey: true,
      });

      const matchesFixture1 =
        JSON.stringify(k1) ===
        JSON.stringify({
          id: "did:key:z5TcCZ8XVyWFn4oN1HmES1fXgUMHrrnUS9qoJWx9EpFngdT6YsJgAvwujpgTt27zfcqRdqG2HWr72PtKqCo79LtqW66fHQSCqr5U23XVy9nAdPsAKqBgwEpVsxCXXJk4DqhHsvUKqgov8oM5Y93RpaNshRxRrZ2Zs4MMeGJ3nz7MMPjCUBDdcZ7f5V5okhDtYQCGRsiiB#zUC75YsVwZ3Fxyi5HEEmADFmKG9rr8cCCYqUcSNwvPZYw1wNCw8bAcpDRnD8eEzLq7qBJYgCHaPCwdHeqZbxMtk5QWtvFeps3dzDMYCXbtTWPQMY42MB9s2XbR5EeYFAxVYyuKu",
          type: "JsonWebKey2020",
          controller:
            "did:key:z5TcCZ8XVyWFn4oN1HmES1fXgUMHrrnUS9qoJWx9EpFngdT6YsJgAvwujpgTt27zfcqRdqG2HWr72PtKqCo79LtqW66fHQSCqr5U23XVy9nAdPsAKqBgwEpVsxCXXJk4DqhHsvUKqgov8oM5Y93RpaNshRxRrZ2Zs4MMeGJ3nz7MMPjCUBDdcZ7f5V5okhDtYQCGRsiiB",
          publicKeyJwk: {
            kty: "EC",
            crv: "BLS12381_G2",
            x: "jWkjdnp3HwZHIqztuACo9-lp7_KgEf7NA50c1D6Ld8zpVADZRYndMIybPVqmChLBA5DfIQTtegezYdbtFD1TzFmU7RaGB1r8mdg6oqKZe4zBNK549-Rg9g2LCedpH4EI",
          },
          privateKeyJwk: {
            kty: "EC",
            crv: "BLS12381_G2",
            x: "jWkjdnp3HwZHIqztuACo9-lp7_KgEf7NA50c1D6Ld8zpVADZRYndMIybPVqmChLBA5DfIQTtegezYdbtFD1TzFmU7RaGB1r8mdg6oqKZe4zBNK549-Rg9g2LCedpH4EI",
            d: "Im8uXuEp-Pug-1MzHEfvkGxMai2eZ2BsNKVkUCQby14",
          },
        });

      setState({ ...state, matchesFixture1, k1 });
    })();
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
