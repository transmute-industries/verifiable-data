import * as cred from '@transmute/credentials-context';
const contexts: any = {
  [cred.constants.CREDENTIALS_CONTEXT_V1_URL]: cred.contexts.get(
    cred.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
};
export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  const message = 'Fixture document loader does not support IRI: ' + iri;
  console.error(message);
  throw new Error(message);
};
