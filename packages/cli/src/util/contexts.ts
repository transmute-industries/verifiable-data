import cred from '@transmute/credentials-context';
import sec from '@transmute/security-context';
import rev from '@transmute/revocation-list-context';

export const contexts: any = {
  'https://www.w3.org/2018/credentials/v1': cred.contexts.get(
    'https://www.w3.org/2018/credentials/v1'
  ),
  'https://w3id.org/security/suites/jws-2020/v1': sec.contexts.get(
    'https://w3id.org/security/suites/jws-2020/v1'
  ),
  'https://w3id.org/vc-revocation-list-2020/v1': rev.contexts.get(
    'https://w3id.org/vc-revocation-list-2020/v1'
  ),
};
