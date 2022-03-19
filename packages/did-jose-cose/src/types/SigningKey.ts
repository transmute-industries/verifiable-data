import { PublicKeyJwk } from "./PublicKeyJwk";
import { PrivateKeyJwk } from "./PrivateKeyJwk";
import { DidUrl } from "@transmute/jsonld-document-loader";
export type SigningKey = {
  id: DidUrl;
  publicKeyJwk: PublicKeyJwk;
  privateKeyJwk: PrivateKeyJwk;
};
