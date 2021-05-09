export interface JsonWebKey2020 {
  id: string;
  type: 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyMultibase: string;
  privateKeyMultibase?: string;
}
