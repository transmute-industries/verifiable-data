import path from 'path';
import fs from 'fs';

export const getCredentialFromFile = (relativePath: string) => {
  const file = fs
    .readFileSync(path.join(process.cwd(), relativePath))
    .toString();

  const parsed = JSON.parse(file);
  if (!parsed.type.includes('VerifiableCredential')) {
    console.log('file is not a credential.');
  }
  return parsed;
};
