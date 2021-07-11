import jsonld from "jsonld";
// import constants from './constants';

import { checkCredential } from "./checkCredential";
import { check } from "@transmute/jsonld-schema";

export const checkPresentation = async (
  presentation: any,
  documentLoader: any,
  strict: "ignore" | "warn" | "throw" = "warn"
) => {
  if (!presentation["@context"]) {
    throw new Error(
      "Verifiable Presentations MUST include a @context property."
    );
  }

  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for checking presentations.'
    );
  }

  const isValidJsonLd = await check({ input: presentation, documentLoader });

  if (!isValidJsonLd.ok) {
    throw new Error(
      `presentation is not valid JSON-LD: ${JSON.stringify(
        isValidJsonLd.error,
        null,
        2
      )}`
    );
  }

  const types = jsonld.getValues(presentation, "type");

  // check type presence
  if (!types.includes("VerifiablePresentation")) {
    throw new Error('"type" must include "VerifiablePresentation".');
  }

  if (presentation.verifiableCredential) {
    const credentials = Array.isArray(presentation.verifiableCredential)
      ? presentation.verifiableCredential
      : [presentation.verifiableCredential];

    await Promise.all(
      credentials.map(async (vc: any) => {
        await checkCredential(vc, documentLoader, strict);
      })
    );
  }
};
