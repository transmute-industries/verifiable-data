import jsonld from "jsonld";
import { check } from "@transmute/jsonld-schema";

import { checkDate } from "./datetime";

function _getId(obj: any) {
  if (typeof obj === "string") {
    return obj;
  }

  if (!("id" in obj)) {
    return;
  }

  return obj.id;
}

export const checkCredential = async (
  credential: any,
  documentLoader: any,
  strict: "ignore" | "warn" | "throw" = "warn"
) => {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1'
  if (typeof credential === "string") {
    // might be a JWT... in which case... there is no way to validate....
    return;
  }

  if (!credential["@context"]) {
    throw new Error("Verifiable Credentials MUST include a @context property.");
  }

  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for checking presentations.'
    );
  }

  const isValidJsonLd = await check({ input: credential, documentLoader });
  if (!isValidJsonLd.ok) {
    throw new Error(
      `credential is not valid JSON-LD: ${JSON.stringify(
        isValidJsonLd.error,
        null,
        2
      )}`
    );
  }

  // check type presence and cardinality
  if (!credential["type"]) {
    throw new Error('"type" property is required.');
  }

  if (!jsonld.getValues(credential, "type").includes("VerifiableCredential")) {
    throw new Error('"type" must include `VerifiableCredential`.');
  }

  if (!credential["credentialSubject"]) {
    throw new Error('"credentialSubject" property is required.');
  }

  if (!credential["issuer"]) {
    throw new Error('"issuer" property is required.');
  }

  // check issuanceDate cardinality
  if (jsonld.getValues(credential, "issuanceDate").length > 1) {
    throw new Error('"issuanceDate" property can only have one value.');
  }

  // check issued is a date
  if (!credential["issuanceDate"]) {
    throw new Error('"issuanceDate" property is required.');
  }

  if ("issuanceDate" in credential) {
    const res = checkDate(credential.issuanceDate);
    if (!res.valid) {
      const message =
        "issuanceDate is not valid: " + JSON.stringify(res.warnings, null, 2);
      if (strict == "warn") {
        console.warn(message);
      }
      if (strict == "throw") {
        throw new Error(message);
      }
    }
  }

  // check expires is a date
  if ("expirationDate" in credential) {
    const res = checkDate(credential.expirationDate);
    if (!res.valid) {
      const message =
        "expirationDate is not valid: " + JSON.stringify(res.warnings, null, 2);
      if (strict == "warn") {
        console.warn(message);
      }
      if (strict == "throw") {
        throw new Error(message);
      }
    }
  }

  // check issuer cardinality
  if (jsonld.getValues(credential, "issuer").length > 1) {
    throw new Error('"issuer" property can only have one value.');
  }

  // check issuer is a URL
  // FIXME
  if ("issuer" in credential) {
    const issuer = _getId(credential.issuer);
    if (!issuer) {
      throw new Error(`"issuer" id is required.`);
    }
    if (!issuer.includes(":")) {
      throw new Error(`"issuer" id must be a URL: ${issuer}`);
    }
  }

  if ("credentialStatus" in credential) {
    if (!credential.credentialStatus.id) {
      throw new Error('"credentialStatus" must include an id.');
    }
    if (!credential.credentialStatus.type) {
      throw new Error('"credentialStatus" must include a type.');
    }
  }

  // check evidences are URLs
  // FIXME
  jsonld.getValues(credential, "evidence").forEach((evidence: any) => {
    const evidenceId = _getId(evidence);
    if (evidenceId && !evidenceId.includes(":")) {
      throw new Error(`"evidence" id must be a URL: ${evidence}`);
    }
  });
};
