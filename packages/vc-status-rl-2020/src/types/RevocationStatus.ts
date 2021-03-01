import { CredentialStatus } from './CredentialStatus';

export interface RevocationStatus extends CredentialStatus {
  revocationListIndex: string;
  revocationListCredential: string;
}
