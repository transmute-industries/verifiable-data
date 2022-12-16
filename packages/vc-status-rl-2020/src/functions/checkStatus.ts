import { decodeList } from './decodeList';
import { getCredentialStatus } from './getCredentialStatus';
import { ld as vc } from '@transmute/vc.js';
import { LinkedDataProofSuite, DocumentLoader } from '../types';

export const checkStatus = async (
  {
    credential,
    documentLoader,
    suite,
    verifyRevocationListCredential = true,
  }: {
    credential: any;
    documentLoader: DocumentLoader;
    suite: LinkedDataProofSuite;
    verifyRevocationListCredential?: boolean;
  } = {} as any
): Promise<{ verified: boolean } | { verified: boolean; error: unknown }> => {
  let result;
  if (!documentLoader) {
    throw new Error('checkStatus requires explicit documentLoader');
  }
  try {
    result = await _checkStatus({
      credential,
      documentLoader,
      suite,
      verifyRevocationListCredential,
    });
  } catch (error) {
    result = {
      verified: false,
      error,
    };
  }
  return result;
};

function getCredentialIssuer(credential: any) {
  if (typeof credential.issuer === 'object') {
    return credential.issuer.id;
  }
  return credential.issuer;
}

async function _checkStatus({
  credential,
  documentLoader,
  suite,
  verifyRevocationListCredential,
}: {
  credential: any;
  documentLoader: any;
  suite: any;
  verifyRevocationListCredential: boolean;
}) {
  if (!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  if (typeof documentLoader !== 'function') {
    throw new TypeError('"documentLoader" must be a function.');
  }
  if (
    verifyRevocationListCredential &&
    !(
      suite &&
      (isArrayOfObjects(suite) ||
        (!Array.isArray(suite) && typeof suite === 'object'))
    )
  ) {
    throw new TypeError('"suite" must be an object or an array of objects.');
  }

  const credentialStatus = getCredentialStatus({ credential });

  // get RL position
  // TODO: bikeshed name
  // see https://w3c-ccg.github.io/vc-http-api/#operation/updateCredentialStatus
  const { revocationListIndex } = credentialStatus;
  const index = parseInt(revocationListIndex, 10);
  if (isNaN(index)) {
    throw new TypeError('"revocationListIndex" must be an integer.');
  }

  // retrieve RL VC
  let rlCredential;
  try {
    ({ document: rlCredential } = await documentLoader(
      credentialStatus.revocationListCredential
    ));
  } catch (e) {
    const err: any = new Error(
      `Could not load "RevocationList2020Credential"; reason: ${
        (e as Error).message
      }`
    );
    err.cause = e;
    throw err;
  }

  // Confirm the Issuers Match
  const credentialIssuer = getCredentialIssuer(credential);
  const listIssuer = getCredentialIssuer(rlCredential);
  const issuerCheck = credentialIssuer === listIssuer;
  if (!issuerCheck) {
    throw new Error(
      'The issuer of this credential does not match the Revocation List issuer.'
    );
  }

  // verify RL VC
  if (verifyRevocationListCredential) {
    const verifyResult = await vc.verifyVerifiableCredential({
      credential: rlCredential,
      documentLoader,
      suite,
    });
    if (!verifyResult.verified) {
      const { error: e } = verifyResult;
      let msg = '"RevocationList2020Credential" not verified';
      if (e) {
        msg += `; reason: ${e.message}`;
      } else {
        msg += '.';
      }
      const err: any = new Error(msg);
      if (e) {
        err.cause = verifyResult.error;
      }
      throw err;
    }
  }

  if (!rlCredential.type.includes('RevocationList2020Credential')) {
    throw new Error('"RevocationList2020Credential" type is not valid.');
  }

  // get JSON RevocationList
  const { credentialSubject: rl } = rlCredential;
  if (rl.type !== 'RevocationList2020') {
    throw new Error('"RevocationList2020" type is not valid.');
  }

  // decode list from RL VC
  const { encodedList } = rl;
  let list;
  try {
    list = await decodeList({ encodedList });
  } catch (e) {
    const err: any = new Error(
      `Could not decode encoded revocation list; reason: ${
        (e as Error).message
      }`
    );
    err.cause = e;
    throw err;
  }

  // check VC's RL index for revocation status
  console.log('how is this hit?');
  const verified = !list.isRevoked(index);

  // TODO: return anything else? returning `rlCredential` may be too unwieldy
  // given its potentially large size
  return { verified };
}

function isArrayOfObjects(x: object[]) {
  return (
    Array.isArray(x) && x.length > 0 && x.every(x => x && typeof x === 'object')
  );
}
