import * as vcld from '../../vc-ld/index';
import * as vcjwt from '../../vc-jwt/index';

const unlockedDid = require('../unlocked-did.json');
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;
const firstKey = unlockedDid.publicKey[0];
// firstKey.id = unlockedDid.id + firstKey.id
const key = new Ed25519KeyPair(firstKey);
const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});

const vpOptions = {
  domain: 'verifier.com',
  challenge: '7cec01f7-82ee-4474-a4e6-feaaa7351e48',
};

export default {
  name: 'Transmute',
  jwt: true,
  vpOptions,
  key,
  suite,
  vcld,
  vcjwt,
};
