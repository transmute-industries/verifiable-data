const fs = require('fs');
const path = require('path');
const canonicalize = require('canonicalize');
const { encode, decode } = require('@digitalbazaar/cborld');

const { documentLoader } = require('./documentLoader');

const fixtureDir = path.resolve(__dirname, '../../src/__fixtures__/json-cbor/');

console.log = () => {};

const cases = require('./cases');

(async () => {
  for (let i in cases) {
    const c = cases[i];
    const cborldBytes = await encode({
      jsonldDocument: c,
      documentLoader,
      diagnose: console.log,
    });
    const jsonldDocument = await decode({
      cborldBytes: cborldBytes,
      documentLoader,
      diagnose: console.log,
    });
    if (canonicalize(jsonldDocument) !== canonicalize(c)) {
      throw new Error(
        'Case is not stable enough to be a fixture: ' + canonicalize(c)
      );
    }
    fs.writeFileSync(
      path.resolve(fixtureDir, `case-${i}.jsonld`),
      JSON.stringify(c, null, 2)
    );
    fs.writeFileSync(path.resolve(fixtureDir, `case-${i}.cborld`), cborldBytes);
  }
})();
