import * as ldp from "@transmute/linked-data-proof";

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
}) => {
  const { presentation, domain, challenge, documentLoader } = options;

  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for presenting.'
    );
  }

  const purpose = new ldp.purposes.AuthenticationProofPurpose({
    domain,
    challenge,
  });

  return ldp.sign(presentation, { ...options, purpose });
};
