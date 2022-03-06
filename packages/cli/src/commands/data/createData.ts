import { handleCommandResponse } from '../../util';

import { typeGenerators } from './generate/typeGenerators';

export const createDataHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  const data = await typeGenerators[argv.type](argv, typeGenerators);
  handleCommandResponse(argv, data, argv.output);
};
