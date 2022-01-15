import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256, getAllCredentialsInDirectory } from '../../../util';
import { createVp } from '../../vc';

const fs = require('fs');
const path = require('path');

import { generateOrganization } from './generateOrganization';
// import { generateProduct } from './generateProduct';
import { generateDevice } from './generateDevice';

const issuerGeneratorMap: any = {
  Organization: generateOrganization,
  Device: generateDevice,
};

// const subjectGeneratorMap: any = {
//   Organization: generateOrganization,
//   Product: generateProduct,
//   Device: generateDevice,
// };

export const generatePresentation = async (
  holderType: string,
  holderSeed: number,
  credentials: any[]
) => {
  const issuerKeys = await generateKey({
    type: 'ed25519',
    seed: sha256(Buffer.from(holderSeed.toString())).toString('hex'),
  });

  faker.seed(holderSeed);
  const holder = await issuerGeneratorMap[holderType](holderSeed);

  const presentation: any = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    type: ['VerifiablePresentation'],
    holder: holder,
  };

  if (credentials && credentials.length) {
    presentation.verifiableCredential = credentials;
  }

  return createVp(presentation, issuerKeys[0]);
};

export const generatePresentationCommand = [
  'data generate presentation [holderType] [holderSeed] [credentialsDirectory]',
  'Generate presentation',
  (yargs: any) => {
    yargs.positional('holderType', {
      choices: ['Organization', 'Device'],
      describe: 'The type used for the holder of the presentation. ',
    });
    yargs.positional('holderSeed', {
      type: 'number',
      describe: 'The seed used to generate the holder of the presentation. ',
    });

    yargs.positional('credentialsDirectory', {
      type: 'string',
      describe: 'The directory containing credentials to present. ',
    });
  },

  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }

    const credentials = getAllCredentialsInDirectory(argv.credentialsDirectory);

    let data = await generatePresentation(
      argv.holderType,
      argv.holderSeed,
      credentials
    );
    if (argv.debug) {
      console.log('generated data', data);
    } else {
      fs.writeFileSync(
        path.resolve(process.cwd(), './data.json'),
        JSON.stringify({ data }, null, 2)
      );
    }
  },
];
