import path from 'path';
import fs from 'fs';

export const getKeyFromFile = (relativePath: string) => {
  const file = fs
    .readFileSync(path.join(process.cwd(), relativePath))
    .toString();

  const parsed = JSON.parse(file);
  //   TODO: test for valid key types

  return parsed;
};
