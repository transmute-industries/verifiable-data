import * as ldp from "@transmute/linked-data-proof";
import { checkPresentation } from "../checkPresentation";
export const createVerifiablePresentation = async (options: {
  presentation: any;
  suite: any;
  domain?: string;
  challenge: string;
  documentLoader: (
    iri: string
  ) => Promise<{
    document: any;
  }>;
  strict?: "ignore" | "warn" | "throw";
}) => {
  const { presentation, domain, challenge, documentLoader } = options;

  const strict = options.strict || "warn";

  await checkPresentation(presentation, { documentLoader, strict });

  const purpose = new ldp.purposes.AuthenticationProofPurpose({
    domain,
    challenge
  });

  return ldp.sign(presentation, { ...options, purpose });
};
