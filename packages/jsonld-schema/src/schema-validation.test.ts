import Ajv from 'ajv';

import GeneratePerson from './__fixtures__/GeneratedPerson.json';
import examplePerson from './__fixtures__/examplePerson.json';

const ajv = new Ajv({ strict: false, removeAdditional: true });
ajv.addSchema(GeneratePerson);

it('can validate person with generated json schema', () => {
  let isValid = ajv.validate(
    {
      $ref: 'https://w3id.org/traceability/schemas/Person.json',
    },
    examplePerson
  );
  expect(isValid).toBe(true);
});

it('fails to validate corrupted person with generated json schema', () => {
  let isValid = ajv.validate(
    {
      $ref: 'https://w3id.org/traceability/schemas/Person.json',
    },
    { ...examplePerson, phoneNumber: 5 }
  );
  expect(isValid).toBe(false);
});
