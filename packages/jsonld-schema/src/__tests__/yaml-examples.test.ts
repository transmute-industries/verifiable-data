import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';

import { schemasToContext } from '../schemasToContext';
import rootTerms from '../__fixtures__/rootTerms.json';

const ajv = new Ajv({ strict: false, removeAdditional: true });

let context: any = {};
let schemas: any = [];
it('can handle directory of yaml file schemas', async () => {
  schemas = fs
    .readdirSync(path.resolve(__dirname, '../__fixtures__/yaml-examples'))
    .map((fileName: string) => {
      const schema = yaml.load(
        fs.readFileSync(
          path.resolve(__dirname, '../__fixtures__/yaml-examples/', fileName),
          'utf8'
        )
      );
      return schema;
    });
  expect(schemas.length).toBe(4);
  schemas.forEach((s: any) => {
    ajv.addSchema(s, '#' + s.title);
  });
});

it('A Person must have an age', async () => {
  let isValid = ajv.validate(
    {
      $ref: '#Person',
    },
    { name: 'Bob' }
  );
  expect(isValid).toBe(false);
  isValid = ajv.validate(
    {
      $ref: '#Person',
    },
    { id: 'did:example:123', name: 'Bob', age: 42 }
  );
  expect(isValid).toBe(true);
});

it('An Organization must have a name', async () => {
  let isValid = ajv.validate(
    {
      $ref: '#Organization',
    },
    { website: 'https://example.com' }
  );
  expect(isValid).toBe(false);
  isValid = ajv.validate(
    {
      $ref: '#Organization',
    },
    { id: 'did:example:456', name: 'Bob Corp' }
  );
  expect(isValid).toBe(true);
});

it('A Certificate must have an issuer', async () => {
  let isValid = ajv.validate(
    {
      $ref: '#Certificate',
    },
    { credentialSubject: { foo: 'bar' } }
  );
  expect(isValid).toBe(false);
  isValid = ajv.validate(
    {
      $ref: '#Certificate',
    },
    {
      issuer: { id: 'did:example:456', name: 'Bob Corp' },
      credentialSubject: { id: 'did:example:123', name: 'Bob', age: 42 },
    }
  );
  // console.log(ajv.errors);
  expect(isValid).toBe(true);
});

it('can generate context from yaml files', async () => {
  // console.log(JSON.stringify(schemas, null, 2));
  context = schemasToContext(schemas, { rootTerms });
  // console.log(JSON.stringify(context, null, 2));
  expect(context).toBeDefined();
  expect(context).toEqual({
    '@context': {
      '@version': 1.1,
      '@vocab': 'https://w3id.org/traceability/#undefinedTerm',
      id: '@id',
      type: '@type',
      name: 'https://schema.org/name',
      description: 'https://schema.org/description',
      identifier: 'https://schema.org/identifier',
      image: {
        '@id': 'https://schema.org/image',
        '@type': '@id',
      },
      relatedLink: {
        '@id': 'https://w3id.org/traceability#LinkRole',
      },
      Certificate: {
        '@id': 'https://schema.org/Certificate',
        '@context': {
          issuer: {
            '@id': 'https://schema.org/Entity',
          },
          credentialSubject: {
            '@id': 'https://schema.org/Entity',
          },
        },
      },
      Entity: {
        '@id': 'https://schema.org/Entity',
        '@context': {},
      },
      Organization: {
        '@id': 'https://schema.org/Organization',
        '@context': {
          name: {
            '@id': 'https://schema.org/name',
          },
          website: {
            '@id': 'https://schema.org/website',
          },
        },
      },
      Person: {
        '@id': 'https://schema.org/Person',
        '@context': {
          name: {
            '@id': 'https://schema.org/name',
          },
          age: {
            '@id': 'https://schema.org/age',
          },
        },
      },
    },
  });
});
