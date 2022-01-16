import faker from 'faker';

export const generateProduct = async (argv: any) => {
  const seed = argv.seed;
  if (seed) {
    faker.seed(seed);
  }
  const id = seed ? seed : faker.random.alphaNumeric();
  return {
    id: `urn:uuid:${id}`,
    type: 'Product',
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
  };
};
