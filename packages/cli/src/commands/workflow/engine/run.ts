import * as tslib_1 from 'tslib';
import { actor } from './actor';
const { Engine } = require('bpmn-engine');
const { EventEmitter } = require('events');

const fake = {
  actor,
};

export const run = (
  instance: any,
  definition: any,
  services: any,
  variables: any
): Promise<{ input: any; output: any }> => {
  return new Promise(resolve => {
    const engine = Engine({
      name: instance,
      source: definition,
    });
    const listener = new EventEmitter();

    engine.execute({
      listener,
      variables: { ...variables, tslib_1 },
      services: { ...services, console, fake },
      extensions: {
        saveToEnvironmentOutput(activity: any, { environment }: any) {
          activity.on('end', (api: any) => {
            environment.output.path = environment.output.path || [];
            environment.output.path.push({
              id: api.id,
              name: api.name,
              output: api.content.output,
            });
          });
        },
      },
    });
    engine.on('end', (execution: any) => {
      execution.environment.output.path.pop();
      const result = {
        input: variables,
        output: execution.environment.output,
      };
      resolve(result);
    });
  });
};
