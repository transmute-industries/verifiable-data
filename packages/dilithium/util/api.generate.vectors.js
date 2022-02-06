const fs = require("fs");
const path = require("path");
const dilithium = require("./api");

const multiplicity = 3;

(async () => {
  for (let i = 0; i < multiplicity; i++) {
    const api = await dilithium.init();
    const privateKeyJwk = await api.generate();
    const { d, ...publicKeyJwk } = privateKeyJwk;
    const message = `message ${i}`;
    const signature = await api.sign(message, privateKeyJwk);
    fs.writeFileSync(
      path.resolve(__dirname, `./__fixtures__/case-${i}.json`),
      JSON.stringify(
        {
          key: {
            id: "did:example:123#key-0",
            controller: "did:example:123",
            type: "JsonWebKey2020",
            publicKeyJwk,
            privateKeyJwk,
          },
          message,
          signature,
        },
        null,
        2
      )
    );
  }
})();
