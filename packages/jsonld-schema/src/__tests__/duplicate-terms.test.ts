import { schemasToContext } from '../schemasToContext';

import dupSchema from '../__fixtures__/DuplicateTerm.json';

it('can handle dups', async () => {
  const context = schemasToContext([dupSchema]);
  expect(context).toEqual({
    '@context': {
      '@version': 1.1,
      id: '@id',
      type: '@type',
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
