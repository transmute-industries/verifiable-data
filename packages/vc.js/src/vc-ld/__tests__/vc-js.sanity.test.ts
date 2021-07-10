import * as fixtures from '../../__fixtures__';
import { runTests } from './sanityTest';
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;
const firstKey = fixtures.unlockedDid.publicKey[0];
// firstKey.id = fixtures.unlockedDid.id + firstKey.id
const key = new Ed25519KeyPair(firstKey);

const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018', () => {
  runTests(suite);
});
