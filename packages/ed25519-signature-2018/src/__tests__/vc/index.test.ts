import { verifiable } from "@transmute/vc.js";
import { Ed25519Signature2018 } from "../..";

import { documentLoader } from "./document-loader";

import vc from "./vc.json";

const main = async () => {
  const result = await verifiable.credential.verify({
    credential: vc,
    format: ["vc"],
    documentLoader,
    suite: [new Ed25519Signature2018()]
  });

  console.log(result);
};

main();
