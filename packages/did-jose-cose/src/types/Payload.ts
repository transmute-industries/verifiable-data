export interface Payload {
  cti?: string;
  jti?: string;
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
}
