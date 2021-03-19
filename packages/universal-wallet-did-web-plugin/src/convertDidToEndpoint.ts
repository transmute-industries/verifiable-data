export const convertDidToEndpoint = (did: string): string => {
  if (did.indexOf('did:web') === 0) {
    const parts = did.split('#')[0].split(':');
    if (parts.length == 3) {
      return `https://${parts[2]}/.well-known/did.json`;
    } else {
      return `https://${parts.splice(2).join('/')}/did.json`;
    }
  } else {
    throw new Error('Only DID Web is Supported.');
  }
};
