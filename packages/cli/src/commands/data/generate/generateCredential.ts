import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';
import { createVc } from '../../credential';

export const generateCredential = async (argv: any, typeGenerators: any) => {
  const subjectType = argv.type.split('Certified').pop();
  const subject = await typeGenerators[subjectType](
    { ...argv, seed: argv.subjectSeed }, // make sure subject generator uses subject seed
    typeGenerators
  );

  const issuer = await typeGenerators[argv.issuerType](
    { ...argv, seed: argv.issuerSeed }, // make sure issuer generator uses issuer seed
    typeGenerators
  );

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    id: 'urn:uuid:' + faker.random.alphaNumeric(8),
    type: ['VerifiableCredential', argv.type],
    issuer: issuer,
    issuanceDate: new Date().toISOString(),
    credentialSubject: subject,
  };
  const issuerKeys = await generateKey({
    type: 'ed25519',
    // unsafe expansion of integer to bytes 32
    // for testing purposes only.
    seed: sha256(Buffer.from(argv.issuerSeed.toString())).toString('hex'),
  });
  const data = await createVc(credential, issuerKeys[0], 'vc');
  return data;
};
