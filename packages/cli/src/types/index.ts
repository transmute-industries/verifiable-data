export interface KeyCommonProps {
  id: string;
  type: string;
  controller: string;
}

export interface JwkPairCommonProps {
  publicKeyJwk: any;
  privateKeyJwk: any;
}

export interface LdPairCommonProps {
  publicKeyBase58: string;
  privateKeyBase58: string;
}

export interface JwkKeyPair extends KeyCommonProps, JwkPairCommonProps {}
export interface LdKeyPair extends KeyCommonProps, LdPairCommonProps {}
export type DidKey = JwkKeyPair | LdKeyPair;
