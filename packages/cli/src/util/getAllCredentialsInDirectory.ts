import path from 'path';
import { readFilesSync } from './readFilesSync';
export const getAllCredentialsInDirectory = (relativePath: string) => {
  const files = readFilesSync(path.join(process.cwd(), relativePath));

  const onlyJson = files.filter((f: any) => {
    return f.ext === '.json';
  });

  const onlyCredentials = onlyJson
    .map((f: any) => {
      return JSON.parse(f.content);
    })
    .filter((data: any) => {
      return data.type && data.type.includes('VerifiableCredential');
    });
  return onlyCredentials;
};
