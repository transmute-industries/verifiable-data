import { schemasToContext } from './schemasToContext';

import Person from './__fixtures__/Person.json';

const schemas = [Person];

it('create context from json schema', () => {
  const context = schemasToContext(schemas);
  expect(context).toEqual({
    '@context': {
      '@version': 1.1,
      id: '@id',
      type: '@type',
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
