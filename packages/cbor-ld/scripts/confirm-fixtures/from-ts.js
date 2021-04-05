const { encode } = require('../../dist');

// console.log('here', encode);

const fs = require('fs');
const path = require('path');
// const canonicalize = require('canonicalize');

const { documentLoader } = require('../documentLoader');

const fixtureDir = path.resolve(__dirname, '../../src/__fixtures__/json-cbor/');

// const diagnose = () => {};

const cases = require('../cases');

const diff = (diffMe, diffBy) => diffMe.split(diffBy).join('');

(async () => {
  for (let i in cases) {
    if (`case-${i}` !== 'case-2') {
      continue;
    }
    const c = cases[i];
    const encoded = await encode(c, documentLoader);
    console.log(encoded);

    const expectedBinary = fs.readFileSync(
      path.resolve(fixtureDir, `case-${i}.cborld`)
    );
    console.log();
    console.log(Buffer.from(encoded).toString('hex'));
    console.log();
    console.log(Buffer.from(expectedBinary).toString('hex'));

    // const jsonldDocument = await decode({
    //   cborldBytes: cborldBytes,
    //   documentLoader,
    //   diagnose,
    // });
    // if (canonicalize(jsonldDocument) !== canonicalize(c)) {
    //   throw new Error(
    //     'Case is not stable enough to be a fixture: ' + canonicalize(c)
    //   );
    // }
    // fs.writeFileSync(
    //   path.resolve(fixtureDir, `case-${i}.jsonld`),
    //   JSON.stringify(c, null, 2)
    // );
    // fs.writeFileSync(path.resolve(fixtureDir, `case-${i}.cborld`), cborldBytes);
  }
})();
