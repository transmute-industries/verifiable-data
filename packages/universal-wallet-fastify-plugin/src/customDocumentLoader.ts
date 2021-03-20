import { documentLoader } from './documentLoader';
import { unsafeDocumentLoader } from './unsafeDocumentLoader';

export default (options: any) => {
  if (options.documentLoader.allowNetwork) {
    console.error = () => {};
  }
  const customDocumentLoader = async (iri: string) => {
    try {
      const res = await documentLoader(iri);
      return res;
    } catch (e) {
      if (options.documentLoader.allowNetwork) {
        const res = await unsafeDocumentLoader(iri);
        return res;
      }
      throw e;
    }
  };

  return customDocumentLoader;
};
