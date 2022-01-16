const fs = require('fs');
const path = require('path');

export const handleCommandResponse = (
  argv: any,
  data: any,
  output = './data.json'
) => {
  if (argv.debug) {
    console.log('generated data:');
    console.log(JSON.stringify(data, null, 2));
  } else {
    const fileData =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    fs.writeFileSync(path.resolve(process.cwd(), output), fileData);
  }
};
