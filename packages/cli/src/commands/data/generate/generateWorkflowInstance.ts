import fs from 'fs';
import path from 'path';

import * as engine from '../../workflow/engine';

import { workflow } from '../../workflow/diagram';

export const generateWorkflowInstance = async (
  argv: any,
  _typeGenerators: any
) => {
  const xml = fs
    .readFileSync(path.resolve(process.cwd(), argv.input))
    .toString();

  let variables = {};

  if (argv.variables) {
    try {
      variables = JSON.parse(argv.variables);
    } catch (e) {
      console.warn('Unable to parse variables, defaulting to empty object.');
    }
  }

  const services = {
    console: console,
  };

  const instanceId = workflow.instance.id();
  const instance = await engine.run(instanceId, xml, services, variables);
  return { inst: instance };
};
