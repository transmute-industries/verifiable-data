import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';

export const generateDevice = async (argv: any) => {
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

  const noun = faker.hacker.noun();
  const adj = faker.hacker.adjective();
  return {
    id: keys[0].controller,
    type: 'Device',
    name:
      faker.random.alphaNumeric(3).toUpperCase() +
      ' ' +
      adj[0].toUpperCase() +
      adj.slice(1) +
      ' ' +
      noun[0].toUpperCase() +
      noun.slice(1),
    description: faker.hacker.phrase(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    mac: faker.internet.mac(),
    ip: faker.internet.ipv6(),
  };
};
