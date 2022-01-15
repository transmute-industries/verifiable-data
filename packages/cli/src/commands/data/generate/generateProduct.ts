import faker from 'faker';

const fs = require('fs');
const path = require('path');

export const generateProduct = async (seed?: number) => {
  const id = seed ? seed : faker.random.alphaNumeric();
  return {
    id: `urn:uuid:${id}`,
    type: 'Product',
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
  };
};

export const generateProductCommand = [
  'data generate product [seed]',
  'Generate product',
  (yargs: any) => {
    yargs.positional('seed', {
      type: 'number',
      describe: 'The seed used to generate the data. ',
    });
  },
  async (argv: any) => {
    const seed = argv.seed;
    if (seed) {
      faker.seed(seed);
    }
    let data = await generateProduct(seed);
    if (argv.debug) {
      console.log('generated data', data);
    } else {
      fs.writeFileSync(
        path.resolve(process.cwd(), './data.json'),
        JSON.stringify({ data }, null, 2)
      );
    }
  },
];
