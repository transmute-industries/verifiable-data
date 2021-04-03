// orignally from https://github.com/digitalbazaar/cborld

export const getJsonLdContexts = (document: object): string[] => {
  const documentContexts = [];
  for (const [key, value] of Object.entries(document)) {
    if (key === '@context') {
      const contexts = Array.isArray(value) ? value : [value];
      if (contexts.some(element => typeof element !== 'string')) {
        throw new Error(
          'An embedded JSON-LD Context was detected in ' +
            `"${JSON.stringify(document)}".`
        );
      }
      documentContexts.push(...contexts);
    } else if (typeof value === 'object') {
      documentContexts.push(...getJsonLdContexts(value));
    } else if (Array.isArray(value)) {
      value.forEach(element => {
        if (typeof element === 'object') {
          documentContexts.push(...getJsonLdContexts(element));
        }
      });
    }
  }
  return Array.from(new Set(documentContexts));
};
