import { assertRevocationList2020Context } from './assertRevocationList2020Context';

export const getCredentialStatus = ({
  credential,
}: { credential?: any } = {}) => {
  if (!(credential && typeof credential === 'object')) {
    throw new TypeError('"credential" must be an object.');
  }
  assertRevocationList2020Context({ credential });
  // get and validate status
  if (
    !(
      credential.credentialStatus &&
      typeof credential.credentialStatus === 'object'
    )
  ) {
    throw new Error('"credentialStatus" is missing or invalid.');
  }
  const { credentialStatus } = credential;
  if (credentialStatus.type !== 'RevocationList2020Status') {
    throw new Error(
      '"credentialStatus" type is not "RevocationList2020Status".'
    );
  }
  if (typeof credentialStatus.revocationListCredential !== 'string') {
    throw new TypeError(
      '"credentialStatus" revocationListCredential must be a string.'
    );
  }

  return credentialStatus;
};
