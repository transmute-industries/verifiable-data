import { vendors } from '../../__fixtures__';

import { testVendors } from './equivalence-checker';

jest.setTimeout(30 * 1000);
testVendors(vendors);
