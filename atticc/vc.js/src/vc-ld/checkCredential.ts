import jsonld from 'jsonld';
import { check } from 'jsonld-checker';
// import constants from './constants';

const dateRegex = new RegExp(
  '^(\\d{4})-(0[1-9]|1[0-2])-' +
    '(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):' +
    '([0-5][0-9]):([0-5][0-9]|60)' +
    '(\\.[0-9]+)?(Z|(\\+|-)([01][0-9]|2[0-3]):' +
    '([0-5][0-9]))$',
  'i'
);

function _getId(obj: any) {
  if (typeof obj === 'string') {
    return obj;
  }

  if (!('id' in obj)) {
    return;
  }

  return obj.id;
}

export const checkCredential = async (credential: any, documentLoader: any) => {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1'
  if (typeof credential === 'string') {
    // might be a JWT... in which case... there is no way to validate....
    return;
  }
  const isValidJsonLd = await check(credential, documentLoader);
  if (!isValidJsonLd.ok) {
    throw new Error(
      `credential is not valid JSON-LD: ${JSON.stringify(
        isValidJsonLd.error,
        null,
        2
      )}`
    );
  }

  // if (credential['@context'][0] !== constants.CREDENTIALS_CONTEXT_V1_URL) {
  //   throw new Error(
  //     `"${constants.CREDENTIALS_CONTEXT_V1_URL}" needs to be first in the ` +
  //       'list of contexts.'
  //   );
  // }

  // check type presence and cardinality
  if (!credential['type']) {
    throw new Error('"type" property is required.');
  }

  if (!jsonld.getValues(credential, 'type').includes('VerifiableCredential')) {
    throw new Error('"type" must include `VerifiableCredential`.');
  }

  if (!credential['credentialSubject']) {
    throw new Error('"credentialSubject" property is required.');
  }

  if (!credential['issuer']) {
    throw new Error('"issuer" property is required.');
  }

  // check issuanceDate cardinality
  if (jsonld.getValues(credential, 'issuanceDate').length > 1) {
    throw new Error('"issuanceDate" property can only have one value.');
  }

  // check issued is a date
  if (!credential['issuanceDate']) {
    throw new Error('"issuanceDate" property is required.');
  }

  if ('issuanceDate' in credential) {
    if (!dateRegex.test(credential.issuanceDate)) {
      throw new Error(
        `"issuanceDate" must be a valid date: ${credential.issuanceDate}`
      );
    }
  }

  // check issuer cardinality
  if (jsonld.getValues(credential, 'issuer').length > 1) {
    throw new Error('"issuer" property can only have one value.');
  }

  // check issuer is a URL
  // FIXME
  if ('issuer' in credential) {
    const issuer = _getId(credential.issuer);
    if (!issuer) {
      throw new Error(`"issuer" id is required.`);
    }
    if (!issuer.includes(':')) {
      throw new Error(`"issuer" id must be a URL: ${issuer}`);
    }
  }

  if ('credentialStatus' in credential) {
    if (!credential.credentialStatus.id) {
      throw new Error('"credentialStatus" must include an id.');
    }
    if (!credential.credentialStatus.type) {
      throw new Error('"credentialStatus" must include a type.');
    }
  }

  // check evidences are URLs
  // FIXME
  jsonld.getValues(credential, 'evidence').forEach((evidence: any) => {
    const evidenceId = _getId(evidence);
    if (evidenceId && !evidenceId.includes(':')) {
      throw new Error(`"evidence" id must be a URL: ${evidence}`);
    }
  });

  // check expires is a date
  if (
    'expirationDate' in credential &&
    !dateRegex.test(credential.expirationDate)
  ) {
    throw new Error(
      `"expirationDate" must be a valid date: ${credential.expirationDate}`
    );
  }
};
