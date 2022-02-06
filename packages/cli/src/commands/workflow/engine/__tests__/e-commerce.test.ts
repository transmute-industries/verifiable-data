import {
  generateECommerceFlow,
  variables,
} from '../../../data/generate/workflows/ecommerce';

import { run } from '../run';
import { getModelViewerHtml } from '../../diagram/getModelViewerHtml';
import path from 'path';
import fs from 'fs';

const scenarioName = 'e-commerce';
const scenarioDirectory = path.resolve(
  process.cwd(),
  './src/commands/data/generate/workflows/scenarios/' + scenarioName
);

// due to issues with typescript, scenarios need to be built in jest,
// and then exported... we cannot dynamically build a scenario via command line atm.

const update = false; // set to true to regenerate cli fixtures for scenario instances.

it('can describe https://w3id.org/traceability/#e-commerce', async () => {
  const def = generateECommerceFlow();
  const xml = def.toBpmn();
  const json = def.toJson();
  const services = {};
  const instance = await run('workflow-run', xml, services, variables);
  expect(instance.output.presentations.length).toBe(6);

  if (update) {
    const indexFilePath = path.resolve(
      scenarioDirectory,
      scenarioName + '.workflow.json'
    );
    const html = getModelViewerHtml(xml);
    const index = {
      xml: xml,
      json: json,
      variables,
    };
    fs.writeFileSync(indexFilePath, JSON.stringify(index, null, 2));
    fs.writeFileSync(indexFilePath.replace('.json', '.html'), html);
  }
});
