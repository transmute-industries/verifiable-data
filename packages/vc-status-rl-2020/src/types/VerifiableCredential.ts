import { CredentialStatus } from './CredentialStatus';
export interface Issuer {
  id: string;
}

export interface VerifiableCredential {
  '@context': string | Array<string | object>;
  id: string;
  type: string | string[];
  issuer: string | Issuer;
  issuanceDate: string;
  expirationDate?: string;
  credentialStatus?: CredentialStatus;
}
