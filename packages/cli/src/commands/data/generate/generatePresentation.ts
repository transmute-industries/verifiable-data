import faker from 'faker';
import { generateKey } from '../../key/generateKey';
import { sha256, getAllCredentialsInDirectory } from '../../../util';
import { createPresentation } from '../../presentation';

export const generatePresentation = async (argv: any, typeGenerators: any) => {
  if (argv.debug) {
    console.log(argv);
  }

  if (argv.holderSeed) {
    faker.seed(argv.holderSeed);
  }
  const holderKeys = await generateKey({
    type: 'ed25519',
    seed: sha256(Buffer.from(argv.holderSeed.toString())).toString('hex'),
  });

  const credentials = getAllCredentialsInDirectory(argv.credentialsDirectory);

  const holder = await typeGenerators[argv.holderType](argv, typeGenerators);

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

  return createPresentation(
    presentation,
    holderKeys[0],
    'vp',
    argv.domain,
    argv.challenge
  );
};
