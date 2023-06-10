import jsonld from "@transmute/jsonld";
import { check } from "@transmute/jsonld-schema";

import { checkDate } from "./checkDate";
import { DocumentLoader } from "../types/DocumentLoader";
import CredentialCheck, {
  CredentialCheckObject
} from "../types/CredentialCheck";
import { VerifiableCredential } from "../types/VerifiableCredential";

function _getId(obj: any) {
  if (typeof obj === "string") {
    return obj;
  }

  if (!("id" in obj)) {
    return;
  }

  return obj.id;
}

const requireContext = (credential: CredentialCheckObject) => {
  if (!credential["@context"]) {
    throw new Error(
      [
        "Verifiable credentials MUST include a @context property.",
        "See: https://www.w3.org/TR/vc-data-model/#dfn-context"
      ].join("")
    );
  }
};

const requireDocumentLoader = (documentLoader?: DocumentLoader) => {
  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for checking presentations.'
    );
  }
};

const handleJWT = (
  credential: CredentialCheck
): { isJWT: boolean; credential: CredentialCheckObject } => {
  let isJWT = false;
  let credentialObj: CredentialCheckObject;
  if (typeof credential === "string") {
    let [encodedHeader, encodedPayload] = credential.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
    if (!header.alg) {
      throw new Error("alg is required in JWT header");
    }
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString()
    );
    credentialObj = payload.vc;
    isJWT = true;
  } else {
    credentialObj = credential;
  }
  return { isJWT, credential: credentialObj };
};

const checkValidJsonLd = async (
  credential: VerifiableCredential,
  documentLoader: (iri: string) => { document: any }
) => {
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

const requireType = (credential: CredentialCheckObject) => {
  if (!credential["type"]) {
    throw new Error(
      "Verifiable credentials MUST have a type specified. See: https://www.w3.org/TR/vc-data-model/#dfn-type"
    );
  }
};

const requireCredentialSubject = (credential: CredentialCheckObject) => {
  if (!credential["credentialSubject"]) {
    throw new Error(
      "Verifiable credentials MUST include a credentialSubject property. See: https://www.w3.org/TR/vc-data-model/#credential-subject"
    );
  }
};

const checkType = (credential: CredentialCheckObject) => {
  if (!jsonld.getValues(credential, "type").includes("VerifiableCredential")) {
    throw new Error(
      "Verifiable credentials type MUST include `VerifiableCredential`. See: https://www.w3.org/TR/vc-data-model/#dfn-type"
    );
  }
};
const requireIssuer = (credential: CredentialCheckObject) => {
  if (!credential["issuer"]) {
    throw new Error(
      "Verifiable credentials MUST include a issuer property. See: https://www.w3.org/TR/vc-data-model/#issuer"
    );
  }
};

const requireIssuanceDate = (credential: CredentialCheckObject) => {
  if (!credential["issuanceDate"]) {
    throw new Error(
      "Verifiable credentials MUST include a issuanceDate. See: https://www.w3.org/TR/vc-data-model/#issuance-date"
    );
  }
};

const checkIssuanceDate = (
  credential: VerifiableCredential,
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
      "issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date"
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
  credential: VerifiableCredential,
  isJWT: boolean,
  strict: "ignore" | "warn" | "throw"
) => {
  if ("expirationDate" in credential) {
    const res = checkDate(credential.expirationDate, isJWT);
    if (!res.valid) {
      const message = [
        "expirationDate is not valid: " + JSON.stringify(res.warnings, null, 2),
        "expirationDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#expiration"
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

const checkIssuer = (credential: VerifiableCredential) => {
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

const checkCredentialStatus = (credential: VerifiableCredential) => {
  if ("credentialStatus" in credential) {
    if (!credential.credentialStatus.id) {
      throw new Error('"credentialStatus" must include an id.');
    }
    if (!credential.credentialStatus.type) {
      throw new Error('"credentialStatus" must include a type.');
    }
  }
};

const checkEvidence = (credential: VerifiableCredential) => {
  // check evidences are URLs
  // FIXME
  jsonld.getValues(credential, "evidence").forEach((evidence: any) => {
    const evidenceId = _getId(evidence);
    if (evidenceId && !evidenceId.includes(":")) {
      throw new Error(`"evidence" id must be a URL: ${evidence}`);
    }
  });
};

const checkId = (credential: VerifiableCredential) => {
  // https://www.rfc-editor.org/rfc/rfc3986#page-50
  const rfc3986Regex = new RegExp(
    "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
  );
  if (credential.id && !rfc3986Regex.test(credential.id)) {
    throw new Error(
      [
        "Verifiable credentials id (if exists) MUST be a RFC3986 URI.",
        "See: https://www.w3.org/TR/vc-data-model/#dfn-id"
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
  credential: VerifiableCredential,
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
  credential: CredentialCheck,
  options: {
    documentLoader?: DocumentLoader;
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
  checkFields(credential as VerifiableCredential, isJWT, strict);
  await checkValidJsonLd(
    credential as VerifiableCredential,
    (documentLoader as unknown) as (iri: string) => { document: any }
  );

  return undefined;
};
