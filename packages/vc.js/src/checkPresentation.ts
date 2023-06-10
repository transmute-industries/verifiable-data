import jsonld from "@transmute/jsonld";
// import constants from './constants';

import { checkCredential } from "./checkCredential";
import { check } from "@transmute/jsonld-schema";

export const checkPresentation = async (
  presentation: any,
  options: {
    documentLoader: any;
    strict: "ignore" | "warn" | "throw";
    domain?: string;
    challenge?: string;
  }
) => {
  const { documentLoader, domain, challenge } = options;
  const strict = options.strict || "warn";

  if (typeof presentation === "string") {
    let [encodedHeader, encodedPayload] = presentation.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
    if (!header.alg) {
      throw new Error("alg is required in JWT header");
    }
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString()
    );
    presentation = payload.vp;
    if (payload.aud) {
      if (payload.aud !== domain) {
        throw new Error(
          '"aud" and "domain" does not match this verifiable presentation'
        );
      }
    }
    if (payload.nonce) {
      if (payload.nonce !== challenge) {
        throw new Error(
          '"nonce" and "challenge" does not match this verifiable presentation'
        );
      }
    }
  }

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
        await checkCredential(vc, { documentLoader, strict });
      })
    );
  }
};
