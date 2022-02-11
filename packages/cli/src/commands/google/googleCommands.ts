import path from 'path';
import fs from 'fs';

import { KeyManagementServiceClient } from '@google-cloud/kms';

import { getDidWebFromGoogleKms } from './kms-did-web/getDidWebFromGoogleKms';

export const googleCommands = [
  'google create did web',
  'Create a DID Web Document with keys stored in Google Cloud KMS.',
  {
    endpoint: {
      alias: 'e',
      description: 'Endpoint used to generate the did web.',
    },
    serviceAccount: {
      alias: 'sa',
      description: 'Path to service account key.',
    },
    keyRing: {
      alias: 'kr',
      description: 'Key ring name.',
    },
    project: {
      alias: 'pr',
      description: 'Project ID to be used.',
    },
    location: {
      alias: 'lo',
      description: 'Location to be used.',
    },
    output: {
      alias: 'o',
      description: 'Path to output file.',
    },
  },
  async (argv: any) => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
      process.cwd(),
      argv.serviceAccount
    );
    const client = new KeyManagementServiceClient();
    const didDocument = await getDidWebFromGoogleKms(
      argv.endpoint,
      client,
      argv.project,
      argv.location,
      argv.keyRing
    );
    const fileContent = JSON.stringify(didDocument, null, 2);
    fs.writeFileSync(path.resolve(process.cwd(), argv.output), fileContent);
    console.log('✨ DID Document Created.');
    console.log(fileContent);
  },
];
