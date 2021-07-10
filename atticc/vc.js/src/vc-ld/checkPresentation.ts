import jsonld from 'jsonld';
// import constants from './constants';

export const checkPresentation = (presentation: any) => {
  // normalize to an array to allow the common case of context being a string
  // const context = Array.isArray(presentation['@context'])
  //   ? presentation['@context']
  //   : [presentation['@context']];

  // ensure first context is 'https://www.w3.org/2018/credentials/v1'
  // if (context[0] !== constants.CREDENTIALS_CONTEXT_V1_URL) {
  //   throw new Error(
  //     `"${constants.CREDENTIALS_CONTEXT_V1_URL}" needs to be first in the ` +
  //       'list of contexts.'
  //   );
  // }

  const types = jsonld.getValues(presentation, 'type');

  // check type presence
  if (!types.includes('VerifiablePresentation')) {
    throw new Error('"type" must include "VerifiablePresentation".');
  }
};
