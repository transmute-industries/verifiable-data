import { googleCommandHandler } from './googleCommands';
export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'google [operationType]',
    describe:
      'A wrapper around a few google cloud libraries that help manage verifiable data.',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: googleCommandHandler,
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
      endpoint: {
        alias: 'e',
        description: 'Endpoint used to generate the did web.',
      },
      serviceAccount: {
        alias: 'sa',
        description: 'Path to service account key.',
      },
      keyRing: {
        alias: 'kr',
        description: 'Key ring name.',
      },
      project: {
        alias: 'pr',
        description: 'Project ID to be used.',
      },
      location: {
        alias: 'lo',
        description: 'Location to be used.',
      },
      output: {
        alias: 'o',
        description: 'Path to output file.',
      },
    },
  });
};
