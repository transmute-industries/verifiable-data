const fs = require("fs");
const path = require("path");

const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");

const message = Buffer.from("hello");
const expectedSignature = fs
  .readFileSync(
    path.resolve(__dirname, "../__fixtures__/raw-ed25519-eddsa.hex")
  )
  .toString();

(async () => {
  const key = await Ed25519VerificationKey2018.from(
    require("../__fixtures__/key-ld.json")
  );

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
