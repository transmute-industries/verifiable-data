import { createDataHandler } from './createData';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'data [operationType]',
    describe: 'See https://www.w3.org/TR/vc-data-model/#lifecycle-details',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: createDataHandler,
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
        choices: ['create'],
      },
    },
  });
};
