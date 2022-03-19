type Base64UrlEncodedHeader = string;
type Base64UrlEncodedPayload = string;
type Base64UrlEncodedSignature = string;

export type CompactJwt =
  `${Base64UrlEncodedHeader}.${Base64UrlEncodedPayload}.${Base64UrlEncodedSignature}`;
