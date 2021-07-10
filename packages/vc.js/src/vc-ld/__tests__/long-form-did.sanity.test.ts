import * as fixtures from '../../__fixtures__';
import { ld as vcld } from '../../index';
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;
const firstKey = fixtures.unlockedDid.publicKey[0];
const key = new Ed25519KeyPair(firstKey);
const shortForm = 'https://short-form-did.example.com/12';
const longForm =
  'https://long-form-did.example.com/123123123123123123123123123';

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018 LongFormDID', () => {
  it('short form works as long as short form did documet is "recoverable"', async () => {
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
        // issuing from a short form works AS LONG AS
        // you know how to get a short form document.
        // this means that anyone who wants to
        // verify things that are not anchored needs to
        // retain long form for as long as they need to do that.
        if (url.split('#')[0] === shortForm) {
          const shortFormDidDoc = require('../../__fixtures__/shortFormDidDoc.json');
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

  it('long form only works when its issuer matches did document', async () => {
    key.controller = `${longForm}`;
    key.id = `${key.controller}#${key.id.split('#').pop()}`;

    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    const credential = {
      ...fixtures.test_vectors.ld.credentialTemplate,
      issuer: {
        id: longForm,
      },
      credentialSubject: {
        ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
        id: fixtures.unlockedDid.id,
      },
    };
    const credentialIssued = await vcld.issue({
      credential: { ...credential },
      suite: suite,
      documentLoader: fixtures.documentLoader,
    });

    const credentialVerified = await vcld.verifyCredential({
      credential: { ...credentialIssued },
      // IMPORTANT must pass empty suite to "rely on document loader"
      // show nothing up my sleave.
      suite: new Ed25519Signature2018({}),
      documentLoader: (url: string) => {
        // issuing from a "long form", only works if
        // you verify with a long form did document.
        if (url.split('#')[0] === longForm) {
          const longFormDidDoc = require('../../__fixtures__/longFormDidDoc.json');
          return {
            contextUrl: null,
            document: longFormDidDoc,
            documentUrl: longFormDidDoc.id,
          };
        }
        return fixtures.documentLoader(url);
      },
    });

    expect(credentialVerified.verified).toBe(true);
  });
});
