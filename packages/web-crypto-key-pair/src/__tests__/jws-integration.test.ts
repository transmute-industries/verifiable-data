import * as web from '../index';

it('can generate  P-384 and sign and verify detached jws ', async () => {
  const kp = await web.key.generate({ kty: 'EC', crvOrSize: 'P-384' });
  //   console.log(JSON.stringify(kp, null, 2));
  //   {
  //     "id": "",
  //     "type": "JsonWebKey2020",
  //     "controller": "",
  //     "publicKeyJwk": {
  //       "kty": "EC",
  //       "crv": "P-384",
  //       "x": "Al0b4DhMaLoDmS9TRb5fc2AsieA6Y0AZ4AM4sHv7KpAnTY9Ior1hEcuVs0I00tNd",
  //       "y": "K2b4-qY1UTHaXoSZFeGK0vn11Et3T48_JgnRHxvsA32fkeuaaA65hiolJ7cG5Fhg"
  //     },
  //     "privateKeyJwk": {
  //       "kty": "EC",
  //       "crv": "P-384",
  //       "x": "Al0b4DhMaLoDmS9TRb5fc2AsieA6Y0AZ4AM4sHv7KpAnTY9Ior1hEcuVs0I00tNd",
  //       "y": "K2b4-qY1UTHaXoSZFeGK0vn11Et3T48_JgnRHxvsA32fkeuaaA65hiolJ7cG5Fhg",
  //       "d": "urNwu6o91AsuRRUOmem1qbB2chyFJZPcGWNMcGPrEpT9aIvtFKQ2G4QKt-7v80AO"
  //     }
  //   }
  const signer = await web.jws.getDetachedJwsSigner(
    await web.key.getCryptoKeyFromJsonWebKey2020(kp)
  );
  const detachedJws = await signer.sign({
    data: new Uint8Array(Buffer.from('hello')),
  });
  // console.log(detachedJws);
  //  eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..EaVHETBQswmnd89qd1F84Mk_yVZgXr-7IR1tU_lKuFW8cEWGg789VaGscV2fj7CvZ_SFIn-u69ho8lnDrfM0FrH9Jj61mSOpAjBAVf6ZOmvD37G-seCQjnsqOFFdXPBh
  const verifier = await web.jws.getDetachedJwsVerifier(
    await web.key.getCryptoKeyFromJsonWebKey2020({
      publicKeyJwk: kp.publicKeyJwk,
    })
  );
  const verified = await verifier.verify({
    data: new Uint8Array(Buffer.from('hello')),
    signature: detachedJws,
  });
  expect(verified).toBe(true);
});
