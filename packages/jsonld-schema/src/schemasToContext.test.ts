import { schemasToContext } from './schemasToContext';

import Person from './__fixtures__/Person.json';
import rootTerms from './__fixtures__/rootTerms.json';

const schemas = [Person];

const version = 1.1;

it('create context from json schema', () => {
  const context = schemasToContext(schemas, version, rootTerms);
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
            '@id': 'https://schema.org/givenName',
          },
          lastName: {
            '@id': 'https://schema.org/familyName',
          },
          email: {
            '@id': 'https://schema.org/email',
          },
          phoneNumber: {
            '@id': 'https://schema.org/telephone',
          },
          worksFor: {
            '@id': 'https://schema.org/worksFor',
          },
          jobTitle: {
            '@id': 'https://schema.org/jobTitle',
          },
        },
      },
    },
  });
});
