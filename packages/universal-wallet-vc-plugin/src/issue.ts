import { verifiable } from "@transmute/vc.js";

import { IssueCredential } from "./types";

const issue = async ({ credential, options }: IssueCredential) => {
  const result = await verifiable.credential.create({
    credential,
    suite: options.suite,
    documentLoader: options.documentLoader
  });
  return result.items[0];
};

export { issue };
