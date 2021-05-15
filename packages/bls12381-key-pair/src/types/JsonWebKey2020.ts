export interface JsonWebKey2020 {
  id: string;
  type: 'JsonWebKey2020';
  controller: string;
  publicKeyJwk: any;
  privateKeyJwk?: any;
}
