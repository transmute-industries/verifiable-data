import * as fixtures from '../__fixtures__';
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { Ed25519Signature2018 } from '..';
import { runTests } from './vc-js-tester';

const key = new Ed25519KeyPair(fixtures.keypair_0);
const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018', () => {
  runTests(suite);
});
