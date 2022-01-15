import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';
const fs = require('fs');
const path = require('path');

export const generateOrganization = async (seed?: number) => {
  const keys = await generateKey({
    type: 'ed25519',
    seed: seed
      ? sha256(Buffer.from(seed.toString())).toString('hex')
      : undefined,
  });
  return {
    id: keys[0].controller,
    type: 'Organization',
    name: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    logo: faker.image.business(),
    website: faker.internet.domainName(),
  };
};

export const generateOrganizationCommand = [
  'data generate organization [seed]',
  'Generate organization',
  (yargs: any) => {
    yargs.positional('seed', {
      type: 'number',
      describe: 'The seed used to generate the data. ',
    });
  },
  async (argv: any) => {
    const seed = argv.seed;
    if (seed) {
      faker.seed(seed);
    }
    let data = await generateOrganization(seed);
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
