export type DocumentLoader = (
  iri: string
) => Promise<{ documentUrl?: string; document: any }>;
