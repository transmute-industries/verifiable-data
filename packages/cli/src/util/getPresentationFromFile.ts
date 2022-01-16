import path from 'path';
import fs from 'fs';

export const getPresentationFromFile = (relativePath: string) => {
  const file = fs
    .readFileSync(path.join(process.cwd(), relativePath))
    .toString();

  const parsed = JSON.parse(file);
  if (!parsed.type.includes('VerifiablePresentation')) {
    console.log('file is not a presentation.');
  }
  return parsed;
};
