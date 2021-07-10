import { vendors } from '../__fixtures__';

import { testVendors } from './equivalence-checker';

describe('linked-data-proof', () => {
  testVendors(vendors);
});
