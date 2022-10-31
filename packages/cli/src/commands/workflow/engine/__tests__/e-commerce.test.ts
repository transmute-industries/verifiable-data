import {
  generateECommerceFlow,
  variables,
} from '../../../data/generate/workflows/ecommerce';

import { run } from '../run';

// due to issues with typescript, scenarios need to be built in jest,
// and then exported... we cannot dynamically build a scenario via command line atm.


it('can describe https://w3id.org/traceability/#e-commerce', async () => {
  const def = generateECommerceFlow();
  const xml = def.toBpmn();
  const services = {};
  const instance = await run('workflow-run', xml, services, variables);
  expect(instance.output.presentations.length).toBe(6);
});
