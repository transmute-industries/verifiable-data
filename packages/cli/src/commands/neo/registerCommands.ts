import { importWorkflowHandler } from './importWorkflowInstance';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'neo [operationType]',
    describe: 'See https://neo4j.com/',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        workflow: importWorkflowHandler,
      };
      if (dispatchHandler[argv.operationType]) {
        return dispatchHandler[argv.operationType](argv);
      } else {
        throw new Error('Unsupported operationType');
      }
    },
    builder: {
      operationType: {
        demand: true,
        choices: ['workflow'],
      },
      input: {
        alias: 'i',
        description: 'Path to workflow instance json',
      },
      clean: {
        alias: 'c',
        description: 'Clean data first',
      },
    },
  });
};
