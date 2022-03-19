import { PublicKeyJwk } from "./PublicKeyJwk";

export interface PrivateKeyJwk extends PublicKeyJwk {
  d: string;
}
