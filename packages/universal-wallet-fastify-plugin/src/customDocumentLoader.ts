import { documentLoader } from './documentLoader';
import { unsafeDocumentLoader } from './unsafeDocumentLoader';

export default (options: any) => {
  if (options.documentLoader.allowNetwork) {
    console.error = () => {};
  }
  const customDocumentLoader = async (iri: string) => {
    try {
      const res = await documentLoader(iri);
      // console.log(res);
      return res;
    } catch (e) {
      // console.log(e);
      if (options.documentLoader.allowNetwork) {
        const res = await unsafeDocumentLoader(iri);
        // console.log(res);
        return res;
      }
      throw e;
    }
  };

  return customDocumentLoader;
};
