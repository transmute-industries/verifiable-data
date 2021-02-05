import { jsonldToSchema } from './jsonldToSchema';

import examplePerson from './__fixtures__/examplePerson.json';

it('create json schema from jsonld', () => {
  const options = {
    baseUrl: 'https://w3id.org/traceability/schemas',
  };
  const schema = jsonldToSchema(examplePerson, options);
  expect(schema).toEqual({
    $id: 'https://w3id.org/traceability/schemas/Person.json',
    $comment: '{"term":"Person","@id":"https://schema.org/Person"}',
    title: '',
    description: '',
    type: 'object',
    properties: {
      type: {
        type: 'string',
      },
      firstName: {
        $comment: '{"term":"firstName","@id":"https://schema.org/givenName"}',
        title: '',
        description: '',
        type: 'string',
      },
      lastName: {
        $comment: '{"term":"lastName","@id":"https://schema.org/familyName"}',
        title: '',
        description: '',
        type: 'string',
      },
      email: {
        $comment: '{"term":"email","@id":"https://schema.org/email"}',
        title: '',
        description: '',
        type: 'string',
      },
      phoneNumber: {
        $comment: '{"term":"phoneNumber","@id":"https://schema.org/telephone"}',
        title: '',
        description: '',
        type: 'string',
      },
      jobTitle: {
        $comment: '{"term":"jobTitle","@id":"https://schema.org/jobTitle"}',
        title: '',
        description: '',
        type: 'string',
      },
      worksFor: {
        $comment: '{"term":"worksFor","@id":"https://schema.org/worksFor"}',
        title: '',
        description: '',
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  });
});
