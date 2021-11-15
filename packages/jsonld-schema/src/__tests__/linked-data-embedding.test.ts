import { schemasToContext } from '../schemasToContext';

import oldStyleSchema from '../__fixtures__/dollar-comment-example.json';
import newStyleSchema from '../__fixtures__/dollar-linked-data-example.json';
import rootTerms from '../__fixtures__/rootTerms.json';

it('can handle $linkedData embedding', async () => {
  const context = schemasToContext([newStyleSchema], { rootTerms });
  expect(context).toEqual({
    '@context': {
      '@version': 1.1,
      '@vocab': 'https://w3id.org/traceability/#undefinedTerm',
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

it('can handle $comment embedding', async () => {
  const context = schemasToContext([oldStyleSchema], { rootTerms });
  expect(context).toEqual({
    '@context': {
      '@version': 1.1,
      '@vocab': 'https://w3id.org/traceability/#undefinedTerm',
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
