import { documentLoader } from "@transmute/universal-wallet-test-vectors";

const customDocumentLoader = async (iri) => {
  // console.log(iri);
  const res = await documentLoader(iri);
  // console.log(res);
  return res;
};

export default customDocumentLoader;
