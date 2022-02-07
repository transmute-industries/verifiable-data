import path from 'path';
import fs from 'fs';

export const getWorkflowInstanceFromFile = (relativePath: string) => {
  const file = fs
    .readFileSync(path.join(process.cwd(), relativePath))
    .toString();

  const parsed = JSON.parse(file);
  //   TODO: test for valid workflow instance types

  return parsed;
};
