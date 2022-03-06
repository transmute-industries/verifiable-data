import path from 'path';
import fs from 'fs';

import { KeyManagementServiceClient } from '@google-cloud/kms';

import { getDidWebFromGoogleKms } from './kms-did-web/getDidWebFromGoogleKms';

export const googleCommandHandler = async (argv: any) => {
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
};
