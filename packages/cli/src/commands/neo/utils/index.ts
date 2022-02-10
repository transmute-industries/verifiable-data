const { importData } = require('../../lib/importData');
const { addLabelsToBlankNodes } = require('../../lib/addLabelsToBlankNodes');
const data0 = require('./0-purchase-order.json');

describe('neo4j', () => {
  beforeAll(async () => {
    const session = driver.session();
    await session.run(
      `
      MATCH (n)
      DETACH DELETE n;
      `
    );

    try {
      await session.run(
        `
        CREATE CONSTRAINT neo_vc ON (n:Node) ASSERT n.id IS UNIQUE;
        `
      );
    } catch (e) {
      // only set once.
    }

    await session.close();
  });
  afterAll(async () => {
    await driver.close();
  });

  it('add data', async () => {
    await importData(data0, driver);
  });

  it('label blank nodes', async () => {
    await addLabelsToBlankNodes(driver);
  });
});
