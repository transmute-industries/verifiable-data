const fs = require("fs");
const path = require("path");

const { Ed25519KeyPair } = require("@transmute/ed25519-key-pair");

const message = Buffer.from("hello");

const expectedSignature = fs
  .readFileSync(
    path.resolve(__dirname, "../__fixtures__/raw-ed25519-eddsa.hex")
  )
  .toString();

(async () => {
  const key = await Ed25519KeyPair.from(require("../__fixtures__/key.json"));

  // it would appear that key conversion in did-key is bugged....
  // const converted = await key.export({
  //   type: "JsonWebKey2020",
  //   privateKey: true,
  // });
  // // console.log(Buffer.from(converted.privateKeyJwk.x, "base64").toString("hex"));
  // // console.log(Buffer.from(converted.privateKeyJwk.d, "base64").toString("hex"));
  // console.log(JSON.stringify(converted, null, 2));

  const signature = Buffer.from(
    await key.signer().sign({
      data: message,
    })
  ).toString("hex");

  if (signature !== expectedSignature) {
    console.log("signature did not match! ");
    console.log(signature);
    console.log(expectedSignature);
    process.exit(1);
  }

  const verified = await key.verifier().verify({
    data: message,
    signature: Buffer.from(expectedSignature, "hex"),
  });

  if (!verified) {
    console.log("signature could not be verified! ");
    process.exit(1);
  }
  //   fs.writeFileSync(
  //     path.join(__dirname, "../__fixtures__/raw-ed25519-edsa.hex"),
  //     signature
  //   );
})();
