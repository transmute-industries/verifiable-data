import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';
import { createCredential } from '../../credential';

export const makeCredential = (
  type: string,
  issuer: any,
  subject: any,
  workflow?: any
) => {
  const credential: any = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    id: 'urn:uuid:' + faker.random.alphaNumeric(8),
    type: ['VerifiableCredential', type],
    issuer: issuer,
    issuanceDate: new Date().toISOString(),
    credentialSubject: subject,
  };
  if (workflow) {
    credential.workflow = workflow;
  }
  return credential;
};

export const makeSignedCredential = async (
  credential: any,
  issuerSeed: number
) => {
  const issuerKeys = await generateKey({
    type: 'ed25519',
    // unsafe expansion of integer to bytes 32
    // for testing purposes only.
    seed: sha256(Buffer.from(issuerSeed.toString())).toString('hex'),
  });
  return createCredential(credential, issuerKeys[0], 'vc');
};

export const issueCredential = async (
  type: string,
  subject: any,
  issuerSeed: string,
  issuerType: string,
  typeGenerators: any
) => {
  const issuer = await typeGenerators[issuerType](
    { type: issuerType, seed: issuerSeed }, // make sure issuer generator uses issuer seed
    typeGenerators
  );
  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    id: 'urn:uuid:' + faker.random.alphaNumeric(8),
    type: ['VerifiableCredential', type],
    issuer: issuer,
    issuanceDate: new Date().toISOString(),
    credentialSubject: subject,
  };
  const issuerKeys = await generateKey({
    type: 'ed25519',
    // unsafe expansion of integer to bytes 32
    // for testing purposes only.
    seed: sha256(Buffer.from(issuerSeed.toString())).toString('hex'),
  });
  const data = await createCredential(credential, issuerKeys[0], 'vc');
  return data;
};

export const generateCredential = async (argv: any, typeGenerators: any) => {
  const subjectType = argv.type.split('Certified').pop();
  const subject = await typeGenerators[subjectType](
    { ...argv, seed: argv.subjectSeed }, // make sure subject generator uses subject seed
    typeGenerators
  );

  return issueCredential(
    argv.type,
    subject,
    argv.issuerSeed,
    argv.issuerType,
    typeGenerators
  );
};
