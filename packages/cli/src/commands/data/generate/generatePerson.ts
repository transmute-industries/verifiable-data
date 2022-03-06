import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';

export const generatePerson = async (argv: { seed: number }) => {
  const { seed } = argv;
  if (seed) {
    faker.seed(seed);
  }
  const keys = await generateKey({
    type: 'ed25519',
    seed: sha256(Buffer.from(seed.toString())).toString('hex'),
  });
  return {
    id: keys[0].controller,
    type: 'Person',
    name: faker.name.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  };
};
