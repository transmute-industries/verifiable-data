// orignally from https://github.com/digitalbazaar/cborld

import { ContextCodec } from './codecs/ContextCodec';

export const getCborLdContexts = ({
  cborMap,
  appContextMap,
}: any): string[] => {
  const contextUrls = [];
  const _entries =
    cborMap instanceof Map ? cborMap.entries() : Object.entries(cborMap);
  for (const [key, value] of _entries) {
    if (key === 1) {
      const contexts = Array.isArray(value) ? value : [value];
      contexts.forEach(element => {
        const encodedContext = new ContextCodec();
        encodedContext.set({ value: element, appContextMap });
        const decodedValue = encodedContext.decodeCBOR();
        if (typeof decodedValue === 'string') {
          contextUrls.push(encodedContext.decodeCBOR());
        }
      });
    } else if (typeof value === 'object') {
      contextUrls.push(...getCborLdContexts({ cborMap: value, appContextMap }));
    } else if (Array.isArray(value)) {
      value.forEach(element => {
        if (typeof element === 'object') {
          contextUrls.push(
            ...getCborLdContexts({ cborMap: element, appContextMap })
          );
        }
      });
    }
  }

  // remove duplicates before returning array
  return Array.from(new Set(contextUrls));
};
