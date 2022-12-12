import jsonld from "jsonld";
import { check } from "@transmute/jsonld-schema";

import { checkDate } from "./checkDate";

function _getId(obj: any) {
  if (typeof obj === "string") {
    return obj;
  }

  if (!("id" in obj)) {
    return;
  }

  return obj.id;
}

const requireContext = (credential: any) => {
  if (!credential["@context"]) {
    throw new Error(
      [
        "Verifiable credentials MUST include a @context property.",
        "See: https://www.w3.org/TR/vc-data-model/#dfn-context",
      ].join("")
    );
  }
};

const requireDocumentLoader = (documentLoader: any) => {
  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for checking presentations.'
    );
  }
};

const handleJWT = (credential: any) => {
  let isJWT = false;
  if (typeof credential === "string") {
    let [encodedHeader, encodedPayload] = credential.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
    if (!header.alg) {
      throw new Error("alg is required in JWT header");
    }
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString()
    );
    credential = payload.vc;
    isJWT = true;
  }
  return { isJWT, credential };
};

const checkValidJsonLd = async (credential: any, documentLoader: any) => {
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
};

const requireType = (credential: any) => {
  if (!credential["type"]) {
    throw new Error(
      "Verifiable credentials MUST have a type specified. See: https://www.w3.org/TR/vc-data-model/#dfn-type"
    );
  }
};

const requireCredentialSubject = (credential: any) => {
  if (!credential["credentialSubject"]) {
    throw new Error(
      "Verifiable credentials MUST include a credentialSubject property. See: https://www.w3.org/TR/vc-data-model/#credential-subject"
    );
  }
};

const checkType = (credential: any) => {
  if (!jsonld.getValues(credential, "type").includes("VerifiableCredential")) {
    throw new Error(
      "Verifiable credentials type MUST include `VerifiableCredential`. See: https://www.w3.org/TR/vc-data-model/#dfn-type"
    );
  }
};
const requireIssuer = (credential: any) => {
  if (!credential["issuer"]) {
    throw new Error(
      "Verifiable credentials MUST include a issuer property. See: https://www.w3.org/TR/vc-data-model/#issuer"
    );
  }
};

const requireIssuanceDate = (credential: any) => {
  if (!credential["issuanceDate"]) {
    throw new Error(
      "Verifiable credentials MUST include a issuanceDate. See: https://www.w3.org/TR/vc-data-model/#issuance-date"
    );
  }
};

const checkIssuanceDate = (
  credential: any,
  isJWT: boolean,
  strict: "ignore" | "warn" | "throw"
) => {
  // check issuanceDate cardinality
  if (jsonld.getValues(credential, "issuanceDate").length > 1) {
    throw new Error('"issuanceDate" property can only have one value.');
  }
  // check issued is a date
  const res = checkDate(credential.issuanceDate, isJWT);
  if (!res.valid) {
    const message = [
      "issuanceDate is not valid: " + JSON.stringify(res.warnings, null, 2),
      "issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date",
    ].join("\n");
    if (strict == "warn") {
      console.warn(message);
    }
    if (strict == "throw") {
      throw new Error(message);
    }
  }
};

const checkExpirationDate = (
  credential: any,
  isJWT: boolean,
  strict: "ignore" | "warn" | "throw"
) => {
  if ("expirationDate" in credential) {
    const res = checkDate(credential.expirationDate, isJWT);
    if (!res.valid) {
      const message = [
        "expirationDate is not valid: " + JSON.stringify(res.warnings, null, 2),
        "expirationDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#expiration",
      ].join("\n");
      if (strict == "warn") {
        console.warn(message);
      }
      if (strict == "throw") {
        throw new Error(message);
      }
    }
  }
};

const checkIssuer = (credential: any) => {
  // check issuer cardinality
  if (jsonld.getValues(credential, "issuer").length > 1) {
    throw new Error('"issuer" property can only have one value.');
  }

  // https://www.rfc-editor.org/rfc/rfc3986#page-50
  const rfc3986Regex = new RegExp(
    "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
  );
  if ("issuer" in credential) {
    const issuer = _getId(credential.issuer);
    if (!issuer) {
      throw new Error(
        `Verifiable credentials issuer:object MUST have an id. See: https://www.w3.org/TR/vc-data-model/#issuer`
      );
    }
    if (!rfc3986Regex.test(issuer)) {
      throw new Error(
        "Verifiable credentials issuer:string MUST be a RFC3986 URI. See: https://www.w3.org/TR/vc-data-model/#issuer, https://www.rfc-editor.org/rfc/rfc3986"
      );
    }
    if (!issuer.includes(":")) {
      throw new Error(`"issuer" id must be a URL: ${issuer}`);
    }
  }
};

const checkCredentialStatus = (credential: any) => {
  if ("credentialStatus" in credential) {
    if (!credential.credentialStatus.id) {
      throw new Error('"credentialStatus" must include an id.');
    }
    if (!credential.credentialStatus.type) {
      throw new Error('"credentialStatus" must include a type.');
    }
  }
};

const checkEvidence = (credential: any) => {
  // check evidences are URLs
  // FIXME
  jsonld.getValues(credential, "evidence").forEach((evidence: any) => {
    const evidenceId = _getId(evidence);
    if (evidenceId && !evidenceId.includes(":")) {
      throw new Error(`"evidence" id must be a URL: ${evidence}`);
    }
  });
};

const checkId = (credential: any) => {
  // https://www.rfc-editor.org/rfc/rfc3986#page-50
  const rfc3986Regex = new RegExp(
    "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
  );
  if (credential.id && !rfc3986Regex.test(credential.id)) {
    throw new Error(
      [
        "Verifiable credentials id (if exists) MUST be a RFC3986 URI.",
        "See: https://www.w3.org/TR/vc-data-model/#dfn-id",
      ].join("")
    );
  }
};

const requireFields = (credential: any) => {
  requireContext(credential);
  requireType(credential);
  requireCredentialSubject(credential);
  requireIssuer(credential);
  requireIssuanceDate(credential);
};

const checkFields = (
  credential: any,
  isJWT: boolean,
  strict: "ignore" | "warn" | "throw"
) => {
  checkType(credential);
  checkIssuanceDate(credential, isJWT, strict);
  checkExpirationDate(credential, isJWT, strict);
  checkIssuer(credential);
  checkCredentialStatus(credential);
  checkEvidence(credential);
  checkId(credential);
};

export const checkCredential = async (
  credential: any,
  options: {
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { documentLoader } = options;
  const strict = options.strict || "warn";
  if (options.strict === "ignore") {
    return undefined;
  }
  const { isJWT, credential: newCredential } = handleJWT(credential);
  credential = newCredential;

  requireDocumentLoader(documentLoader);
  requireFields(credential);
  checkFields(credential, isJWT, strict);
  await checkValidJsonLd(credential, documentLoader);

  return undefined;
};
