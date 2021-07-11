import * as ldp from "@transmute/linked-data-proof";
import jsonld from "jsonld";
import { checkPresentation } from "../checkPresentation";

import { verifyVerifiableCredential } from "./verifyVerifiableCredential";

export const verifyVerifiablePresentation = async (options: any) => {
  const { documentLoader, domain, challenge } = options;

  const strict = options.strict || "warn";

  const { presentation, unsignedPresentation } = options;

  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for verifying.'
    );
  }

  try {
    if (!presentation && !unsignedPresentation) {
      throw new TypeError(
        'A "presentation" or "unsignedPresentation" property is required for verifying.'
      );
    }

    let vp = null;
    if (presentation && unsignedPresentation) {
      throw new Error(
        '"presentation" or "unsignedPresentation" are required, NOT both.'
      );
    }

    let presentationResult = null;
    if (presentation) {
      await checkPresentation(presentation, documentLoader, strict);
      vp = presentation;
      if (!vp.proof) {
        throw new Error('presentation MUST contain "proof"');
      }

      if (!options.presentationPurpose && !challenge) {
        throw new Error(
          'A "challenge" param is required for AuthenticationProofPurpose.'
        );
      }

      const purpose = new ldp.purposes.AuthenticationProofPurpose({
        domain,
        challenge,
      });

      let suite = options.suite;

      presentationResult = await ldp.verify(presentation, {
        purpose,
        ...options,
        suite,
      });
    }

    if (unsignedPresentation) {
      await checkPresentation(unsignedPresentation, documentLoader, strict);
      vp = unsignedPresentation;
      if (vp.proof) {
        throw new Error('unsignedPresentation MUST NOT contain "proof"');
      }
    }

    // if verifiableCredentials are present, verify them, individually
    let credentialResults: any;
    let verified = true;
    const credentials = jsonld.getValues(vp, "verifiableCredential");
    if (credentials.length > 0) {
      // verify every credential in `verifiableCredential`
      credentialResults = await Promise.all(
        credentials.map((credential: any) => {
          return verifyVerifiableCredential({ credential, ...options });
        })
      );

      credentialResults = credentialResults.map((cr: any, i: any) => {
        cr.credentialId = credentials[i].id;
        return cr;
      });

      const allCredentialsVerified = credentialResults.every(
        (r: any) => r.verified
      );
      if (!allCredentialsVerified) {
        verified = false;
      }
    }

    if (unsignedPresentation) {
      // No need to verify the proof section of this presentation
      return { verified, results: [vp], credentialResults };
    }

    return {
      presentationResult,
      verified: verified && presentationResult.verified,
      credentialResults,
      error: presentationResult.error,
    };
  } catch (error) {
    return {
      verified: false,
      results: [{ presentation, verified: false, error }],
      error,
    };
  }
};
