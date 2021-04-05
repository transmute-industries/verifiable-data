const fs = require('fs');
const path = require('path');

let cases: any = {};

fs.readdirSync(__dirname).forEach((file: any) => {
  if (file.includes('.jsonld') || file.includes('.cborld')) {
    const [caseName] = file.split('.');
    let fixture = cases[caseName] || { name: caseName, cborld: '', jsonld: '' };
    try {
      fixture.jsonld = JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, caseName + '.jsonld'))
          .toString()
      );
      fixture.cborld = Uint8Array.from(
        fs.readFileSync(path.resolve(__dirname, caseName + '.cborld'))
      );
    } catch (e) {
      throw new Error(
        'Could not find cborld and jsonld fixture for ' + caseName
      );
    }
    cases[caseName] = fixture;
  }
});

export default Object.values(cases);
