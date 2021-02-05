import jsonld from 'jsonld';
import { TextDecoder, stringToUint8Array } from '../util';
import * as hl from '../index';
import { Hashlink } from '../Hashlink';
const defaultCodecs = require('../codecs');

// // setup test data
const testData = stringToUint8Array('Hello World!\n');
const exampleUrl = 'https://example.com/hw.txt';

// setup JSON-LD tests
/* eslint-disable quotes */
const jsonldData = {
  '@type': ['http://schema.org/Person'],
  'http://schema.org/jobTitle': [{ '@value': 'Professor' }],
  'http://schema.org/name': [{ '@value': 'Jane Doe' }],
  'http://schema.org/telephone': [{ '@value': '(425) 123-4567' }],
  'http://schema.org/url': [{ '@id': 'http://www.janedoe.com' }],
};

class Urdna2015 {
  public identifier: any;
  public algorithm: any;

  constructor() {
    this.identifier = stringToUint8Array('urdna2015');
    this.algorithm = 'urdna2015';
  }

  async encode(input: any) {
    const inputJsonld = JSON.parse(new TextDecoder().decode(input));
    return stringToUint8Array(
      await jsonld.canonize(inputJsonld, { format: 'application/n-quads' })
    );
  }
}

describe('hashlink library', () => {
  describe(`Hashlink class`, () => {
    describe(`encode() [sha2-256]`, () => {
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          codecs: ['mh-sha2-256', 'mb-base58-btc'],
        });
        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH'
        );
      });

      it('encode({data, urls, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-sha2-256', 'mb-base58-btc'],
        });

        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
            'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy'
        );
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain',
          },
          codecs: ['mh-sha2-256', 'mb-base58-btc'],
        });

        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        );
      });
    });

    describe(`encode() [blake2b-64]`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          codecs: ['mh-blake2b-64', 'mb-base58-btc'],
        });

        expect(result).toBe('hl:zm9YZpCjPLPJ4Epc');
      });

      it('encode({data, urls, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          codecs: ['mh-blake2b-64', 'mb-base58-btc'],
        });

        expect(result).toBe(
          'hl:zm9YZpCjPLPJ4Epc:' +
            'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy'
        );
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain',
          },
          codecs: ['mh-blake2b-64', 'mb-base58-btc'],
        });

        expect(result).toBe(
          'hl:zm9YZpCjPLPJ4Epc:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        );
      });
    });

    describe(`encode() [urdna2015]`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('encode({data, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015'],
        });

        expect(result).toBe('hl:zm9YaHWNePhdaQ2J');
      });

      it('encode({data, urls, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          urls: [exampleUrl],
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015'],
        });

        expect(result).toBe(
          'hl:zm9YaHWNePhdaQ2J:' +
            'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy'
        );
      });

      it('encode({data, urls, meta, codecs}) should encode a hashlink', async () => {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain',
          },
          codecs: ['urdna2015', 'mh-blake2b-64', 'mb-base58-btc'],
          transform: ['urdna2015'],
        });

        expect(result).toBe(
          'hl:zm9YaHWNePhdaQ2J:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        );
      });
    });

    describe(`verify() [sha2-256]`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async () => {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH',
        });
        expect(result).toBe(true);
      });
    });

    describe(`verify() [blake2b-64]`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new defaultCodecs.MultihashBlake2b64());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async () => {
        const result = await hlInstance.verify({
          data: testData,
          hashlink: 'hl:zm9YZpCjPLPJ4Epc',
        });

        expect(result).toBe(true);
      });
    });

    describe(`verify() [urdna2015]`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hlInstance.verify({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          hashlink:
            'hl:zQmVcHtE3hUCF3s6fgjohUL3ANsKGnmRC9UsEaAjZuvgzdc:' +
            'zER21ZLCmb3bkKNtm8g',
        });

        expect(result).toBe(true);
      });
    });

    describe(`use()`, () => {
      // setup the encoder/decoder
      const hlInstance = new Hashlink();
      hlInstance.use(new Urdna2015());
      hlInstance.use(new defaultCodecs.MultihashSha2256());
      hlInstance.use(new defaultCodecs.MultibaseBase58btc());

      it('use() with custom JSON-LD transform', async function() {
        const result = await hlInstance.encode({
          data: stringToUint8Array(JSON.stringify(jsonldData)),
          codecs: ['urdna2015', 'mh-sha2-256', 'mb-base58-btc'],
        });

        expect(result).toBe(
          'hl:zQmVcHtE3hUCF3s6fgjohUL3ANsKGnmRC9UsEaAjZuvgzdc'
        );
      });
    });
  });

  describe(`convenience functionality`, () => {
    describe(`encode()`, () => {
      it('encode({data}) should encode a hashlink', async () => {
        const result = await hl.encode({
          data: testData,
        });

        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH'
        );
      });
      it('encode({data, urls}) should encode a hashlink', async () => {
        const result = await hl.encode({
          data: testData,
          urls: [exampleUrl],
        });

        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
            'z3TSgXTuaHxY2tsArhUreJ4ixgw9NW7DYuQ9QTPQyLHy'
        );
      });

      it('encode({data, urls, meta}) should encode a hashlink', async function() {
        const result = await hl.encode({
          data: testData,
          urls: [exampleUrl],
          meta: {
            'content-type': 'text/plain',
          },
        });

        expect(result).toBe(
          'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH:' +
            'zCwPSdabLuj3jue1qYujzunnKwpL4myKdyeqySyFhnzZ8qdfW3bb6W8dVdRu'
        );
      });
    });

    describe(`verify() [sha2-256]`, function() {
      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zQmNbCYUrvaVfy6w9b5W3SVTP2newPK5FoeY37QurUEUydH',
        });

        expect(result).toBe(true);
      });
    });

    describe(`verify() [blake2b-64]`, function() {
      it('verify({data, hashlink}) should verify a hashlink', async function() {
        const result = await hl.verify({
          data: testData,
          hashlink: 'hl:zm9YZpCjPLPJ4Epc',
        });
        expect(result).toBe(true);
      });
    });
  });
});
