export const convertEndpointToDid = (endpoint: string): string => {
  const url = new URL(endpoint);
  if (endpoint.includes('.well-known/did.json')) {
    return `did:web:${url.hostname}`;
  }
  return `did:web:${url.hostname}${url.pathname
    .replace(/\//g, ':')
    .replace(':did.json', '')}`;
};
