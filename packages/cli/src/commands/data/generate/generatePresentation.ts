import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256, getAllCredentialsInDirectory } from '../../../util';
import { createPresentation } from '../../presentation';

export const makePresentation = (
  holder: any,
  credentials: any[],
  workflow?: any
) => {
  const presentation: any = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    id: 'urn:uuid:' + faker.random.alphaNumeric(8),
    type: ['VerifiablePresentation'],
    holder: holder,
    verifiableCredential: credentials,
  };
  if (workflow) {
    presentation.workflow = workflow;
  }
  if (presentation.verifiableCredential.length === 0) {
    delete presentation.verifiableCredential;
  }
  return presentation;
};

export const makeSignedPresentationFromSeed = async (
  presentation: any,
  holderSeed: number,
  domain: string,
  challenge: string
) => {
  const holderKeys = await generateKey({
    type: 'ed25519',
    seed: sha256(Buffer.from(holderSeed.toString())).toString('hex'),
  });
  return makeSignedPresentation(presentation, holderKeys[0], domain, challenge);
};

const makeSignedPresentation = (
  presentation: any,
  key: any,
  domain: string,
  challenge: string
) => {
  return createPresentation(presentation, key, 'vp', domain, challenge);
};

export const generatePresentation = async (argv: any, typeGenerators: any) => {
  if (argv.debug) {
    console.log(argv);
  }

  if (argv.holderSeed) {
    faker.seed(argv.holderSeed);
  }

  const credentials = getAllCredentialsInDirectory(argv.credentialsDirectory);

  const holder = await typeGenerators[argv.holderType](argv, typeGenerators);

  const presentation: any = makePresentation(holder, credentials);

  if (credentials && credentials.length) {
    presentation.verifiableCredential = credentials;
  }

  return makeSignedPresentationFromSeed(
    presentation,
    argv.holderSeed,
    argv.domain,
    argv.challenge
  );
};
