import { generateKey } from './generateKey';
import { deriveKey } from './derive';

import { handleCommandResponse } from '../../util';
export { generateKey };

export const generateKeyCommand = [
  'key generate',
  'Generate key pair',
  {
    seed: {
      alias: 's',
      description: 'Seed to generate key from',
    },
    output: {
      alias: 'o',
      description: 'Path to output document',
      demandOption: true,
    },
    type: {
      alias: 't',
      description: 'Type of key to derive',
    },
    mnemonic: {
      alias: 'm',
      description: 'Mnemonic to derive key',
    },
    hdpath: {
      alias: 'hd',
      description: 'HD Path to derive key',
    },
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let data;
    if (argv.seed) {
      data = await generateKey({
        type: argv.type,
        seed: argv.seed,
      });
    }

    if (argv.mnemonic) {
      data = await deriveKey(argv.type, argv.mnemonic, argv.hdpath);
    }

    handleCommandResponse(argv, data);
  },
];
