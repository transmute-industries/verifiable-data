### @transmute/jsonld-schema

```
npm i @transmute/jsonld-schema@latest --save
```

This module provides support for working with JSON-LD and JSON Schema together.

#### Usage

##### Validation without JSON Schema

```ts
import { check } from '@transmute/jsonld-schema';
import * as cred from '@transmute/credentials-context';

const input = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  id: 'http://example.gov/credentials/3732',
  type: ['VerifiableCredential'],
  issuer: 'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
  issuanceDate: '2020-03-10T04:24:12Z',
  credentialSubject: { id: 'did:example:ebfeb1f712ebc6f1c276e12ec21' },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2020-03-10T04:24:12Z',
    proofPurpose: 'assertionMethod',
    verificationMethod:
      'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    jws:
      'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nH9EoZEQLZdIG8zcFbmxk4fXhTDSveQ07Ulf1SjAWZxh1ojbDPo0H67JGEG64F-lHJYxiVehzqwPWTd1-9IBAw',
  },
};

const contexts: any = {
  [cred.constants.CREDENTIALS_CONTEXT_V1_URL]: cred.contexts.get(
    cred.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
};

const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  const message = 'Document loader does not support IRI: ' + iri;
  console.error(message);
  throw new Error(message);
};

const res = await check({
  input,
  documentLoader,
});
// res.ok === true
```

##### Validation with JSON Schema

```ts
const schema = {
  title: 'W3C Verifiable Credential',
  type: 'object',
  properties: {
    '@context': {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
        },
      ],
    },
    id: {
      type: 'string',
    },
    type: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
        },
      ],
    },
    issuer: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
          },
        },
      ],
    },
    issuanceDate: { type: 'string' },
    credentialSubject: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
          },
          additionalProperties: false,
        },
      ],
    },
    proof: {
      type: 'object',
      properties: {
        type: {
          oneOf: [
            {
              type: 'string',
            },
            {
              type: 'array',
            },
          ],
        },
        created: {
          type: 'string',
        },
        proofPurpose: {
          type: 'string',
        },
        verificationMethod: {
          type: 'string',
        },
        jws: {
          type: 'string',
        },
      },
      additionalProperties: false,
    },
  },
  required: ['@context'],
  additionalProperties: false,
};

const res = await check({
  input,
  schema,
  documentLoader,
});
// res.ok === true
```

##### JSON-LD to JSON Schema

```ts
import { jsonldToSchema } from '@transmute/jsonld-schema';

const person = {
  '@context': {
    Person: {
      '@id': 'https://schema.org/Person',
    },
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
    jobTitle: {
      '@id': 'https://schema.org/jobTitle',
    },
    worksFor: {
      '@id': 'https://schema.org/worksFor',
    },
  },
  type: 'Person',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  phoneNumber: '555-555-5555',
  jobTitle: 'Director of Quality',
  worksFor: ['https://example.com/organizations/123'],
};

const schema = jsonldToSchema(person, {
  baseUrl: 'https://w3id.org/traceability/schemas',
});
```

##### JSON Schemas to JSON-LD Context

```ts
import { schemasToContext } from '@transmute/jsonld-schema';
const schemas = [
  {
    $id: 'https://w3id.org/traceability/schemas/Person.json',
    $comment: '{"term": "Person", "@id": "https://schema.org/Person"}',
    title: 'Person',
    description: 'A person',
    type: 'object',
    properties: {
      '@context': {
        type: 'array',
      },
      type: {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
          },
        ],
      },
      firstName: {
        $comment:
          '{"term": "firstName", "@id": "https://schema.org/givenName"}',
        title: 'First Name',
        description: "Person's first name.",
        type: 'string',
      },
      lastName: {
        $comment:
          '{"term": "lastName", "@id": "https://schema.org/familyName"}',
        title: 'Last Name',
        description: "Person's last name.",
        type: 'string',
      },
      email: {
        $comment: '{"term": "email", "@id": "https://schema.org/email"}',
        title: "Person's Email Address",
        description: "Person's email address.",
        type: 'string',
      },
      phoneNumber: {
        $comment:
          '{"term": "phoneNumber", "@id": "https://schema.org/telephone"}',
        title: 'Phone Number',
        description: "Person's contact phone number.",
        type: 'string',
      },
      worksFor: {
        $comment: '{"term": "worksFor", "@id": "https://schema.org/worksFor"}',
        title: 'Works For',
        description: 'Company which employs the person.',
        $ref: 'https://w3id.org/traceability/schemas/Organization.json',
      },
      jobTitle: {
        $comment: '{"term": "jobTitle", "@id": "https://schema.org/jobTitle"}',
        title: 'Job Title',
        description: "Person's job title.",
        type: 'string',
      },
    },
    additionalProperties: false,
  },
];
const context = schemasToContext(schemas);
// {
//     '@context': {
//       '@version': 1.1,
//       id: '@id',
//       type: '@type',
//       Person: {
//         '@id': 'https://schema.org/Person',
//         '@context': {
//           firstName: {
//             '@id': 'https://schema.org/givenName',
//           },
//           lastName: {
//             '@id': 'https://schema.org/familyName',
//           },
//           email: {
//             '@id': 'https://schema.org/email',
//           },
//           phoneNumber: {
//             '@id': 'https://schema.org/telephone',
//           },
//           worksFor: {
//             '@id': 'https://schema.org/worksFor',
//           },
//           jobTitle: {
//             '@id': 'https://schema.org/jobTitle',
//           },
//         },
//       },
//     },
//   }
```

#### Related Projects

We use this approach to help generate the [traceability vocab](https://github.com/w3c-ccg/traceability-vocab).
