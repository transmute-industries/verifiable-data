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

const isJwt = (input: string) => {
  return input.split('.').length == 3;
};

const importData = async (argv: any) => {
  let content;
  if (argv.input.startsWith('http')) {
    const { document } = await documentLoader(argv.input);
    content = document;
  } else {
    if (isJwt(argv.input)) {
      const encodedPayload = argv.input.split('.')[1];
      const decodedPayload = Buffer.from(encodedPayload, 'base64').toString();
      const parsedPayload = JSON.parse(decodedPayload);
      content = parsedPayload.vc;
    } else {
      const inputAbsolutePath = path.resolve(process.cwd(), argv.input);
      const inputFileContent = fs.readFileSync(inputAbsolutePath).toString();
      const inputJson = JSON.parse(inputFileContent);
      content = inputJson;
    }
  }

  // todo: we really should use a caching loader in cli.
  const framedContent = await jsonld.frame(content, { documentLoader });

  const driver = getDriver(argv.uri, argv.user, argv.password);
  const session = driver.session();
  if (argv.force) {
    await dropTables(session);
  }
  await enableJsonLd(session);
  const query = `
    CALL n10s.rdf.import.inline(
      '${JSON.stringify(framedContent).replace(/'/g, "\\'")}', 'JSON-LD')
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
