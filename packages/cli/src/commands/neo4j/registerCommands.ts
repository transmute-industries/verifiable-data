import fs from 'fs';
import path from 'path';
import jsonld from 'jsonld';
import { documentLoader } from './documentLoader';
import { getDriver } from './getDriver';

const dropTables = async (session: any) => {
  await session.run(
    `
MATCH (n)
DETACH DELETE n;
`
  );
};

const enableJsonLd = async (session: any) => {
  try {
    await session.run(
      `
CREATE CONSTRAINT n10s_unique_uri ON (r:Resource)
ASSERT r.uri IS UNIQUE
  `
    );
  } catch (e) {}

  try {
    await session.run(
      `
CALL n10s.graphconfig.init({
handleVocabUris: 'MAP'
})
  `
    );
  } catch (e) {}
};

const importData = async (argv: any) => {
  const inputAbsolutePath = path.resolve(process.cwd(), argv.input);
  const inputFileContent = fs.readFileSync(inputAbsolutePath).toString();
  const inputJson = JSON.parse(inputFileContent);
  const content =
    inputJson['@context'] !== undefined
      ? await jsonld.frame(inputJson, { documentLoader }) // todo: we really should use a caching loader in cli.
      : inputJson;

  const driver = getDriver(argv.uri, argv.user, argv.password);
  const session = driver.session();
  if (argv.force) {
    await dropTables(session);
  }
  await enableJsonLd(session);
  const query = `
    CALL n10s.rdf.import.inline(
      '${JSON.stringify(content).replace(/'/g, "\\'")}', 'JSON-LD')
      `;
  await session.run(query);
  await driver.close();
  console.log('Graph data imported successfully.');
};

const dispatchHandler: any = {
  import: importData,
};

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'neo4j [operationType]',
    describe: 'See https://neo4j.com',
    handler: (argv: any) => {
      if (dispatchHandler[argv.operationType]) {
        return dispatchHandler[argv.operationType](argv);
      } else {
        throw new Error('Unsupported operationType');
      }
    },
    builder: {
      operationType: {
        demand: true,
        choices: Object.keys(dispatchHandler),
      },
      force: {
        alias: 'f',
        description: 'Delete all data before import',
      },
      input: {
        alias: 'i',
        description: 'Path to json file',
      },
    },
  });
};
