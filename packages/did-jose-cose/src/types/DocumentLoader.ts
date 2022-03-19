import { DidUrl } from "@transmute/jsonld-document-loader";
import { VerificationKey } from "./VerificationKey";

export type DocumentLoaderResponse = { document: VerificationKey };
export type DocumentLoader = (iri: DidUrl) => Promise<DocumentLoaderResponse>;
