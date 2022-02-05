import fs from 'fs';
import path from 'path';

import * as engine from '../../workflow/engine';

import { workflow } from '../../workflow/diagram';

import faker from 'faker';

export const generateWorkflowInstance = async (
  argv: any,
  typeGenerators: any
) => {
  const xml = fs
    .readFileSync(path.resolve(process.cwd(), argv.input))
    .toString();

  const definitionId = workflow.definition.id();
  const instanceId = workflow.instance.id();

  let variables: any = {
    workflow: {
      definition: [definitionId],
      instance: [instanceId],
    },
  };

  if (argv.variables) {
    try {
      variables = { variables, ...JSON.parse(argv.variables) };
    } catch (e) {
      console.warn('Unable to parse variables, defaulting to empty object.');
    }
  } else {
    const importer = {
      id: 'did:web:importer.example:0',
      name: 'Acme Shoes (Importer of Record)',
      location: { lat: 45.494904, long: -122.804836 },
    };

    const manufacturer = {
      id: 'did:web:manufacturer.example:1',
      name: '鞋匠 (Contract Manufacturer)',
      location: {
        lat: 41.12361,
        long: 122.99,
      },
    };

    const distributor = {
      id: 'did:web:distributor.example:2',
      name: 'Sko (Product Distributor)',
      location: {
        lat: 55.711737,
        long: 12.562321,
      },
    };

    const customs = {
      id: 'did:web:regulator.example:3',
      name: 'US Customs (Regulator)',
    };

    const oceanCarrier = {
      id: 'did:web:carrier.example:4',
      name: 'Nautiske (Ocean Carrier)',
    };

    const airCarrier = {
      id: 'did:web:carrier.example:5',
      name: 'Wright Logistics (Air Carrier)',
    };

    const product = {
      id: 'did:web:product.example:6',
      name: 'Road Runners (Product)',
      type: 'Sneakers',
    };

    variables = {
      ...variables,
      importer,
      manufacturer,
      distributor,
      customs,
      oceanCarrier,
      airCarrier,
      product,
    };

    // // // use this to generate variable arguments.
    // console.log(JSON.stringify(variables));
  }

  const fake = {
    types: typeGenerators,
    credential: ({ type, issuer, subject }: any) => {
      const credential = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
          { '@vocab': 'https://ontology.example/vocab/#' },
        ],
        id: 'urn:uuid:' + faker.random.alphaNumeric(8),
        type: ['VerifiableCredential', type],
        issuer: issuer,
        issuanceDate: new Date().toISOString(),
        credentialSubject: subject,
      };
      return credential;
    },
    presentation: ({ from, to, workflow, credentials }: any) => {
      const presentation: any = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
          { '@vocab': 'https://ontology.example/vocab/#' },
        ],
        workflow,
        type: ['VerifiablePresentation'],
        holder: from,
        verifier: to,
        verifiableCredential: credentials,
      };
      return presentation;
    },
  };
  const services = {
    console: console,
    fake,
  };

  const instance = await engine.run(instanceId, xml, services, variables);
  return { inst: instance };
};
