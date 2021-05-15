export interface Ed25519VerificationKey2020 {
  id: string;
  type: 'Ed25519VerificationKey2020';
  controller: string;
  publicKeyMultibase: string;
  privateKeyMultibase?: string;
}
