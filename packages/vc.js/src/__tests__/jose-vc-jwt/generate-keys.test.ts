// import fs from "fs";
// import path from "path";
const { generateKeyPair } = require("jose/util/generate_key_pair");
const { fromKeyLike } = require("jose/jwk/from_key_like");

const keyTypes = ["EdDSA", "ES256K", "ES384"];

describe("Key Generation", () => {
  keyTypes.forEach(keyType => {
    it(`can generate ${keyType}`, async () => {
      const { privateKey } = await generateKeyPair(keyType);
      const privateKeyJwk = await fromKeyLike(privateKey);
      expect(privateKeyJwk).toBeDefined();
      /*
      fs.writeFileSync(
        path.resolve(__dirname, `./__fixtures__/${keyType}.privateKeyJwk.json`),
        JSON.stringify(privateKeyJwk, null, 2)
      );
      */
    });
  });
});
