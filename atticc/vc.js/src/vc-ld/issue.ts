import { sign } from '@transmute/linked-data-proof';
import { IIssueOptions } from '../types';
import { CredentialIssuancePurpose } from './purposes';
import { checkCredential } from './checkCredential';

export const issue = async (options: IIssueOptions) => {
  const { credential, suite, documentLoader } = options;

  // run common credential checks
  if (!credential) {
    throw new TypeError('"credential" parameter is required for issuing.');
  }
  await checkCredential(credential, documentLoader);

  if (!documentLoader) {
    throw new TypeError('"documentLoader" parameter is required for issuing.');
  }

  if (!suite) {
    throw new TypeError('"suite" parameter is required for issuing.');
  }
  // check to make sure the `suite` has required params
  // Note: verificationMethod defaults to publicKey.id, in suite constructor...
  // ...in some implementations...
  if (!suite.verificationMethod) {
    throw new TypeError('"suite.verificationMethod" property is required.');
  }

  const purpose = options.purpose || new CredentialIssuancePurpose();

  return sign(credential, { purpose, ...options });
};
