import { JsonWebKey2020 } from '../types';
import c0 from './key-pairs/case-0.json';
import c1 from './key-pairs/case-1.json';
import c2 from './key-pairs/case-2.json';
import c3 from './key-pairs/case-3.json';

const keys = {
  c0,
  c1,
  c2,
  c3,
} as { [key: string]: JsonWebKey2020 };

export { keys };
