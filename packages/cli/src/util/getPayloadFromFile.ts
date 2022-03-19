import path from 'path';
import fs from 'fs';

export const getPayloadFromFile = (relativePath: string) => {
  const file = fs
    .readFileSync(path.join(process.cwd(), relativePath))
    .toString();
  const parsed = JSON.parse(file);
  return parsed;
};
