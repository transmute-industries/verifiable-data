export interface Header {
  kid?: string;
  alg?: "ES256" | "ES384" | "EdDSA" | "ES256K";
}
