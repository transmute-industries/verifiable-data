import { createPresentationHandler } from './createPresentation';
import { verifyPresentationHandler } from './verifyPresentation';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'presentation [operationType]',
    describe: 'See https://www.w3.org/TR/vc-data-model/#presentations',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: createPresentationHandler,
        verify: verifyPresentationHandler,
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
        choices: ['create', 'verify'],
      },
    },
  });
};
