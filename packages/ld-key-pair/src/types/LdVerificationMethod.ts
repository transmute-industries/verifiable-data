export interface PublicNodeBase {
  id: string;
  type: string;
  controller: string;
}

export interface PublicNodeWithPublicKeyJwk extends PublicNodeBase {
  publicKeyJwk: any;
}

export interface PublicNodeWithPublicBase58 extends PublicNodeBase {
  publicKeyBase58: string;
}

export type LdVerificationMethod =
  | PublicNodeWithPublicKeyJwk
  | PublicNodeWithPublicBase58;
