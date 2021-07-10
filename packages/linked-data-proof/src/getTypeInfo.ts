import jsonld from 'jsonld';

import { IGetTypeInfoOptions } from './types';

const getTypeInfo = async ({
  document,
  documentLoader,
  expansionMap,
}: IGetTypeInfoOptions) => {
  // determine `@type` alias, if any
  const ctx = jsonld.getValues(document, '@context');
  const compacted = await jsonld.compact({ '@type': '_:b0' }, ctx, {
    documentLoader,
    expansionMap,
  });
  delete compacted['@context'];
  const alias = Object.keys(compacted)[0];

  // optimize: expand only `@type` and `type` values
  const toExpand: any = { '@context': ctx };
  toExpand['@type'] = jsonld
    .getValues(document, '@type')
    .concat(jsonld.getValues(document, alias));
  const expanded =
    (await jsonld.expand(toExpand, { documentLoader, expansionMap }))[0] || {};
  return { types: jsonld.getValues(expanded, '@type'), alias };
};

export default getTypeInfo;
