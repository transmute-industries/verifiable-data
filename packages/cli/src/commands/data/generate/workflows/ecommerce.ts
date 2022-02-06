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
  const def = workflow.definition.create({ id: workflow.definition.id() });

  def.addStart({ id: 'StartEvent_0', name: 'Start' });

  def.addTask({
    id: 'Task_0',
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
        source: 'StartEvent_0',
        name: 'Import Started',
      },
    ],
  });

  def.addTask({
    id: 'Task_1',
    name: 'Product Manufactured in China',
    task: async ({ output, variables }: WorkflowEnvironment) => {
      // services.console.log('product manufactured in China.');
      const { manufacturer }: { manufacturer: Actor } = output.actors;
      const vc1 = await manufacturer.credential.generate({
        type: 'CertifiedOrigin',
        subject: {
          ...variables.product,
        },
      });
      const vc2 = await manufacturer.credential.generate({
        type: 'CertifiedCommercialInvoice',
        subject: {
          ...variables.product,
        },
      });
      const vc3 = await manufacturer.credential.generate({
        type: 'CertifiedPackingList',
        subject: {
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
        source: 'Task_0',
        name: 'Fill Order',
      },
    ],
  });

  def.addTask({
    id: 'Task_2',
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
        source: 'Task_1',
        name: 'Ocean Transport',
      },
    ],
  });

  def.addTask({
    id: 'Task_3',
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
          ...variables.product,
        },
      });

      const vc2 = await distributor.credential.generate({
        type: 'CertifiedCommercialInvoice',
        subject: {
          ...variables.product,
        },
      });

      // technically there must be VP between the distributor and the carrier
      // but for the sake of a simpler model, we assume out of band
      // credential exchange here.

      const vc3 = await airCarrier.credential.generate({
        type: 'CertifiedAirWaybill',
        subject: {
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
        source: 'Task_2',
        name: 'Air Transport',
      },
    ],
  });

  def.addTask({
    id: 'Task_4',
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
        source: 'Task_3',
        name: 'Process US Customs Entry',
      },
    ],
  });

  def.addTask({
    id: 'Task_5',
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
        source: 'Task_4',
        name: 'Ship to Importer Of Record',
      },
    ],
  });

  def.addStop({
    id: 'EndEvent_0',
    name: 'End',
    edges: [
      {
        source: 'Task_5',
        name: 'Import Completed',
      },
    ],
  });

  return def;
};
