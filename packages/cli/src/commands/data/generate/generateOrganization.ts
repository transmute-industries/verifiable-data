import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';

export const generateOrganization = async (argv: { seed: any }) => {
  const seed = argv.seed;
  if (seed) {
    faker.seed(seed);
  }
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
