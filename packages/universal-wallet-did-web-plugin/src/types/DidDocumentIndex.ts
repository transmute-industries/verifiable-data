import { DidDocument } from '@did-core/data-model';

export interface DidDocumentIndex {
  [did: string]: DidDocument;
}
