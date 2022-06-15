import axios from 'axios';

export const documentLoader = async (iri: string) => {
  if (iri.startsWith('http')) {
    const { data } = await axios.get(iri);
    return { document: data };
  }
  const message = 'Unsupported iri: ' + iri;
  console.warn(message);
  throw new Error(message);
};
