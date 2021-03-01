export interface DocumentLoaderResponse {
  documentUrl: string;
  document: object;
}

export type DocumentLoader = (iri: string) => Promise<DocumentLoaderResponse>;
