import * as jsonldSchema from '../index';

it('confirm exports', async () => {
  expect(jsonldSchema.jsonldToSchema).toBeDefined();
  expect(jsonldSchema.schemasToIntermediate).toBeDefined();
  expect(jsonldSchema.schemasToContext).toBeDefined();
});
