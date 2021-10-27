import { schemasToContext } from '../schemasToContext';

import dupSchema from '../__fixtures__/DuplicateTerm.json';
import rootTerms from '../__fixtures__/rootTerms.json';

const version = 1.1;

it('can handle dups', async () => {
  const context = schemasToContext([dupSchema], version, rootTerms);
  expect(context).toEqual({
    '@context': {
      '@version': version,
      id: '@id',
      type: '@type',
      ...rootTerms,
      Person: {
        '@id': 'https://schema.org/Person',
        '@context': {
          firstName: {
            '@id': 'https://schema.org/name',
          },
          lastName: {
            '@id': 'https://schema.org/name',
          },
        },
      },
    },
  });
});
