import { PublicKeyJwk } from "./PublicKeyJwk";
import { DidUrl } from "@transmute/jsonld-document-loader";
export type JsonWebKey = {
  publicKeyJwk: PublicKeyJwk;
};

export type DocumentLoaderResponse = { document: JsonWebKey };
export type DocumentLoader = (iri: DidUrl) => Promise<DocumentLoaderResponse>;
