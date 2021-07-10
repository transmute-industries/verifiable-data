import goodCase0 from './good-case-0.json';
import goodCase1 from './good-case-1.json';

import badCase0 from './bad-case-0.json';
import badCase1 from './bad-case-1.json';

import VerifiableCredential from './schemas/w3c-standard-vc.schema.json';
import { documentLoader } from './documentLoader';
const good = {
  goodCase0,
  goodCase1,
};

const bad = {
  badCase0,
  badCase1,
};

const schemas = {
  VerifiableCredential,
};

export { good, bad, schemas, documentLoader };
