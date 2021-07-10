import * as fixtures from '../../__fixtures__';
import { ld as vcld } from '../../index';
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;
const firstKey = fixtures.unlockedDid.publicKey[0];
const key = new Ed25519KeyPair(firstKey);
const shortForm = 'https://short-form-did.example.com/12';

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018 baseURI', () => {
  it('works with `@base`', async () => {
    key.controller = `${shortForm}`;
    key.id = `${key.controller}#${key.id.split('#').pop()}`;

    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    const credential = {
      ...fixtures.test_vectors.ld.credentialTemplate,
      issuer: {
        id: shortForm,
      },
      credentialSubject: {
        ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
        id: fixtures.unlockedDid.id,
      },
    };
    const credentialIssued = await vcld.issue({
      credential: { ...credential },
      suite: suite,
      documentLoader: (url: string) => {
        return fixtures.documentLoader(url);
      },
    });

    const credentialVerified = await vcld.verifyCredential({
      credential: { ...credentialIssued },
      // IMPORTANT must pass empty suite to "rely on document loader"
      // show nothing up my sleave.
      suite: new Ed25519Signature2018({}),
      documentLoader: (url: string) => {
        if (url.split('#')[0] === shortForm) {
          const shortFormDidDoc = require('../../__fixtures__/shortFormDidDoc.json');
          expect(shortFormDidDoc['@context'][1]).toEqual({
            '@base': 'https://short-form-did.example.com/12',
          });
          return {
            contextUrl: null,
            document: shortFormDidDoc,
            documentUrl: shortFormDidDoc.id,
          };
        }
        return fixtures.documentLoader(url);
      },
    });
    expect(credentialVerified.verified).toBe(true);
  });

  it('works without `@base`', async () => {
    key.controller = `${shortForm}`;
    key.id = `${key.controller}#${key.id.split('#').pop()}`;

    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    const credential = {
      ...fixtures.test_vectors.ld.credentialTemplate,
      issuer: {
        id: shortForm,
      },
      credentialSubject: {
        ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
        id: fixtures.unlockedDid.id,
      },
    };
    const credentialIssued = await vcld.issue({
      credential: { ...credential },
      suite: suite,
      documentLoader: (url: string) => {
        return fixtures.documentLoader(url);
      },
    });

    const credentialVerified = await vcld.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader: (url: string) => {
        if (url.split('#')[0] === shortForm) {
          const shortFormDidDoc = require('../../__fixtures__/shortFormDidDoc.json');
          shortFormDidDoc['@context'] = ['https://w3id.org/did/v0.11'];
          expect(shortFormDidDoc['@context']).toEqual([
            'https://w3id.org/did/v0.11',
          ]);
          return {
            contextUrl: null,
            document: shortFormDidDoc,
            documentUrl: shortFormDidDoc.id,
          };
        }
        return fixtures.documentLoader(url);
      },
    });
    expect(credentialVerified.verified).toBe(true);
  });
});
