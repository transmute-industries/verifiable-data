import faker from 'faker';
import { generateKey } from '../../key/generate';
import { sha256 } from '../../../util';
import { createVc } from '../../vc/createVc';

const fs = require('fs');
const path = require('path');

import { generateOrganization } from './generateOrganization';
import { generateProduct } from './generateProduct';
import { generateDevice } from './generateDevice';

const issuerGeneratorMap: any = {
  Organization: generateOrganization,
  Device: generateDevice,
};

const subjectGeneratorMap: any = {
  Organization: generateOrganization,
  Product: generateProduct,
  Device: generateDevice,
};

export const generateCertifiedSubjectTypeCredential = async (
  issuerType: string,
  issuerSeed: number,
  subjectType: string,
  subjectSeed: number
) => {
  const issuerKeys = await generateKey({
    type: 'ed25519',
    seed: sha256(Buffer.from(issuerSeed.toString())).toString('hex'),
  });

  faker.seed(issuerSeed);
  const issuer = await issuerGeneratorMap[issuerType](issuerSeed);
  faker.seed(subjectSeed);
  const subject = await subjectGeneratorMap[subjectType](subjectSeed);

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
      { '@vocab': 'https://ontology.example/vocab/#' },
    ],
    id: 'urn:uuid:' + faker.random.alphaNumeric(8),
    type: ['VerifiableCredential', 'Certified' + subjectType],
    issuer: issuer,
    issuanceDate: new Date().toISOString(),
    credentialSubject: subject,
  };

  return createVc(credential, issuerKeys[0]);
};

export const generateCertifiedSubjectTypeCredentialCommand = [
  'data generate credential [issuerType] [issuerSeed] [subjectType] [subjectSeed]',
  'Generate credential',
  (yargs: any) => {
    yargs.positional('issuerSeed', {
      type: 'number',
      describe: 'The seed used to generate the issuer of the credential. ',
    });
    yargs.positional('subjectSeed', {
      type: 'number',
      describe: 'The seed used to generate the subject of the credential. ',
    });
    yargs.positional('issuerType', {
      choices: ['Organization', 'Device'],
      describe: 'The type used for the issuer of the credential. ',
    });
    yargs.positional('subjectType', {
      choices: ['Organization', 'Device', 'Product'],
      describe: 'The type used for the subject of the credential. ',
    });
  },

  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let data = await generateCertifiedSubjectTypeCredential(
      argv.issuerType,
      argv.issuerSeed,
      argv.subjectType,
      argv.subjectSeed
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
