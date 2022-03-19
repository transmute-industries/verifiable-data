import { PublicKeyJwk } from "./PublicKeyJwk";
import { DidUrl } from "@transmute/jsonld-document-loader";
export type VerificationKey = {
  id: DidUrl;
  publicKeyJwk: PublicKeyJwk;
};
