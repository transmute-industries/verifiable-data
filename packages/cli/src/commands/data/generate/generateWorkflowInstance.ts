import { run } from '../../workflow/engine/run';

import ecommerce from './workflows/scenarios/e-commerce/e-commerce.scenario.json';

export const generateWorkflowInstance = async (argv: any) => {
  const { input } = argv;
  let workflowVariables;
  let xml;
  switch (input) {
    case 'https://w3id.org/traceability/#e-commerce': {
      workflowVariables = ecommerce.variables;
      xml = ecommerce.xml;
      break;
    }
    default: {
      throw new Error(
        'Unsupported scenario. Try using "https://w3id.org/traceability/#e-commerce"'
      );
    }
  }

  if (argv.variables) {
    try {
      workflowVariables = {
        ...workflowVariables,
        ...JSON.parse(argv.variables),
      };
    } catch (e) {
      console.warn('Unable to parse variables, defaulting to empty object.');
    }
  }
  const services = {};
  const instance = await run('workflow-run', xml, services, workflowVariables);

  return { inst: instance };
};
