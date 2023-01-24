import { workflow } from '../../../workflow/diagram';

import { WorkflowEnvironment, Actor } from '../../../workflow/engine/types';
const importer = {
  id: 'did:web:importer.example:0',
  name: 'Acme Shoes (Importer of Record)',
  location: { lat: 45.494904, long: -122.804836 },
  seed: 0,
};

const manufacturer = {
  id: 'did:web:manufacturer.example:1',
  name: '鞋匠 (Contract Manufacturer)',
  location: {
    lat: 41.12361,
    long: 122.99,
  },
  seed: 1,
};

const distributor = {
  id: 'did:web:distributor.example:2',
  name: 'Sko (Product Distributor)',
  location: {
    lat: 55.711737,
    long: 12.562321,
  },
  seed: 2,
};

const customs = {
  id: 'did:web:regulator.example:3',
  name: 'US Customs (Regulator)',
  seed: 3,
};

const oceanCarrier = {
  id: 'did:web:carrier.example:4',
  name: 'Nautiske (Ocean Carrier)',
  seed: 4,
};

const airCarrier = {
  id: 'did:web:carrier.example:5',
  name: 'Wright Logistics (Air Carrier)',
  seed: 5,
};

const product = {
  id: 'did:web:product.example:6',
  name: 'Road Runners (Product)',
  type: 'Sneakers',
  seed: 6,
};

export const variables = {
  importer,
  manufacturer,
  distributor,
  customs,
  oceanCarrier,
  airCarrier,
  product,
};

export const generateECommerceFlow = () => {
  const def = workflow.definition.create({ id: `urn:uuid:${workflow.definition.id()}` });

  const startId = `urn:uuid:${workflow.definition.id()}#StartEvent_0`
  def.addStart({ id: startId, name: 'Start' });

  const task0Id = `urn:uuid:${workflow.definition.id()}#Task_0`
  def.addTask({
    id: task0Id,
    name: 'Order Received in China',
    task: async ({ output, services, variables }: WorkflowEnvironment) => {
      // services.console.log('product ordered from China.');
      output.actors = output.actors || {};
      output.presentations = output.presentation || [];
      const manufacturer = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.manufacturer.seed, // controls identity
      });
      output.actors.manufacturer = manufacturer;
      const vc1 = await manufacturer.credential.generate({
        type: 'CertifiedPurchaseOrder',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          manufacturer: variables.manufacturer,
          product: variables.product,
        },
      });
      const vp1 = await manufacturer.present({
        workflow: variables.workflow,
        credentials: [vc1],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: startId,
        name: 'Import Started',
      },
    ],
  });

  const task1Id = `urn:uuid:${workflow.definition.id()}#Task_1`
  def.addTask({
    id: task1Id,
    name: 'Product Manufactured in China',
    task: async ({ output, variables }: WorkflowEnvironment) => {
      // services.console.log('product manufactured in China.');
      const { manufacturer }: { manufacturer: Actor } = output.actors;
      const vc1 = await manufacturer.credential.generate({
        type: 'CertifiedOrigin',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });
      const vc2 = await manufacturer.credential.generate({
        type: 'CertifiedCommercialInvoice',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });
      const vc3 = await manufacturer.credential.generate({
        type: 'CertifiedPackingList',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });
      const vp1 = await manufacturer.present({
        workflow: variables.workflow,
        credentials: [vc1, vc2, vc3],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: task0Id,
        name: 'Fill Order',
      },
    ],
  });

  const task2Id = `urn:uuid:${workflow.definition.id()}#Task_2`
  def.addTask({
    id: task2Id,
    name: 'Product Shipped to Denmark',
    task: async ({ output, services, variables }: WorkflowEnvironment) => {
      // services.console.log('product shipped Denmark.');
      const oceanCarrier = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.oceanCarrier.seed,
      });
      output.actors.oceanCarrier = oceanCarrier;
      const vc1 = await oceanCarrier.credential.generate({
        type: 'CertifiedBillOfLading',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });
      const vp1 = await oceanCarrier.present({
        workflow: variables.workflow,
        credentials: [vc1],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: task1Id,
        name: 'Ocean Transport',
      },
    ],
  });

  const task3Id = `urn:uuid:${workflow.definition.id()}#Task_3`
  def.addTask({
    id: task3Id,
    name: 'Product Shipped to United States',
    task: async ({ output, services, variables }: WorkflowEnvironment) => {
      // services.console.log('product shipped to US.');
      const distributor = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.distributor.seed,
      });
      output.actors.distributor = distributor;

      const airCarrier = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.airCarrier.seed,
      });
      output.actors.airCarrier = airCarrier;

      const vc1 = await distributor.credential.generate({
        type: 'CertifiedUSImportDeclaration',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });

      const vc2 = await distributor.credential.generate({
        type: 'CertifiedCommercialInvoice',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });

      // technically there must be VP between the distributor and the carrier
      // but for the sake of a simpler model, we assume out of band
      // credential exchange here.

      const vc3 = await airCarrier.credential.generate({
        type: 'CertifiedAirWaybill',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });

      const vp1 = await airCarrier.present({
        workflow: variables.workflow,
        credentials: [vc1, vc2, vc3],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: task2Id,
        name: 'Air Transport',
      },
    ],
  });

  const task4Id = `urn:uuid:${workflow.definition.id()}#Task_4`
  def.addTask({
    id: task4Id,
    name: 'US Customs Approval',
    task: async ({ output, services, variables }: WorkflowEnvironment) => {
      // services.console.log('product import approved.');
      const customs = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.customs.seed,
      });
      output.actors.customs = customs;
      // receive presentations of relevant credentials
      // see output.presentations.
      // skipping review here, lets assume all the documents are in order.

      // issue certificate of approval
      const vc1 = await customs.credential.generate({
        type: 'CertifiedImportAproval',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
        },
      });
      const vp1 = await customs.present({
        workflow: variables.workflow,
        credentials: [vc1],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: task3Id,
        name: 'Process US Customs Entry',
      },
    ],
  });

  const task5Id = `urn:uuid:${workflow.definition.id()}#Task_5`
  def.addTask({
    id: task5Id,
    name: 'Product Sold in US',
    task: async ({ output, services, variables }: WorkflowEnvironment) => {
      // services.console.log('product sold.');
      const importer = await services.fake.actor.generate({
        type: 'Organization',
        seed: variables.importer.seed,
      });
      output.actors.importer = importer;

      const traceabilityPath = output.path.map((i: any) => {
        return { id: i.id, name: i.name };
      });

      const vc1 = await importer.credential.generate({
        type: 'CertifiedProductHistory',
        subject: {
          id: `urn:uuid${workflow.definition.id()}`,
          ...variables.product,
          history: traceabilityPath,
        },
      });
      const vp1 = await importer.present({
        workflow: variables.workflow,
        credentials: [vc1],
      });
      output.presentations.push(vp1);
      return {};
    },
    edges: [
      {
        source: task4Id,
        name: 'Ship to Importer Of Record',
      },
    ],
  });

  const endId = `urn:uuid:${workflow.definition.id()}#EndEvent_0`
  def.addStop({
    id: endId,
    name: 'End',
    edges: [
      {
        source: task5Id,
        name: 'Import Completed',
      },
    ],
  });

  return def;
};
