import moment from 'moment';
import { IVcJwtPayload } from '../types';
import { checkCredential } from '../vc-ld/checkCredential';

const isObject = (data: any) => {
  if (Array.isArray(data)) {
    return false;
  }
  if (
    (typeof data === 'object' || typeof data === 'function') &&
    data !== null
  ) {
    return true;
  }
  return false;
};
export const issue = async (
  credentialTemplate: any,
  signer: any,
  documentLoader: any
) => {
  if (credentialTemplate.issuer === undefined) {
    throw new Error('Verifiable Credentials require an "issuer".');
  }

  if (
    credentialTemplate.credentialSubject === undefined ||
    credentialTemplate.credentialSubject.id === undefined
  ) {
    throw new Error('Verifiable Credentials require an "subject".');
  }

  let issuer = isObject(credentialTemplate.issuer)
    ? credentialTemplate.issuer.id
    : credentialTemplate.issuer;

  let subject = credentialTemplate.credentialSubject.id;

  await checkCredential(credentialTemplate, documentLoader);

  const payload: IVcJwtPayload = {
    iss: issuer,
    sub: subject,
    vc: credentialTemplate,
  };

  if (credentialTemplate.id) {
    payload.jti = credentialTemplate.id;
  }

  if (credentialTemplate.issuanceDate) {
    payload.nbf = moment(credentialTemplate.issuanceDate).unix();
  }

  if (credentialTemplate.expirationDate) {
    payload.exp = moment(credentialTemplate.expirationDate).unix();
  }
  // console.log(JSON.stringify(payload, null, 2))
  const header = {};
  return signer.sign(payload, header);
};
