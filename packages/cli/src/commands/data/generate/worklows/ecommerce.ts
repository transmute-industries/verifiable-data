import { workflow } from '../../../workflow/diagram';

export const generateECommerceFlow = () => {
  const def = workflow.definition.create({ id: workflow.definition.id() });

  def.addStart({ id: 'StartEvent_0', name: 'Start' });

  def.addTask({
    id: 'Task_0',
    name: 'Order Received in China',
    task: ({ variables, output, services }: any) => {
      services.console.log('product ordered from China.');
      const vc1 = services.fake.credential({
        type: 'PurchaseOrder',
        issuer: variables.importer,
        subject: {
          manufacturer: variables.manufacturer,
          product: variables.product,
        },
      });

      output.presentations = output.presentation || [];

      output.presentations.push(
        services.fake.presentation({
          from: variables.importer,
          to: variables.manufacturer,
          workflow: variables.workflow,
          credentials: [vc1],
        })
      );
      // services.console.log('output: ', JSON.stringify(output, null, 2));
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
    task: ({ variables, output, services }: any) => {
      services.console.log('product manufactured in China.');

      const vc1 = services.fake.credential({
        type: 'CertificateOfOrigin',
        issuer: variables.manufacturer,
        subject: {
          product: variables.product,
        },
      });
      const vc2 = services.fake.credential({
        type: 'CommercialInvoice',
        issuer: variables.manufacturer,
        subject: {
          product: variables.product,
        },
      });
      const vc3 = services.fake.credential({
        type: 'PackingList',
        issuer: variables.manufacturer,
        subject: {
          product: variables.product,
        },
      });

      output.presentations.push(
        services.fake.presentation({
          from: variables.manufacturer,
          to: variables.importer,
          workflow: variables.workflow,
          credentials: [vc1, vc2, vc3],
        })
      );

      // services.console.log('output: ', output);
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
    task: ({ variables, output, services }: any) => {
      services.console.log('product shipped Denmark.');

      const vc1 = services.fake.credential({
        type: 'BillOfLading',
        issuer: variables.oceanCarrier,
        subject: {
          product: variables.product,
        },
      });

      output.presentations.push(
        services.fake.presentation({
          from: variables.oceanCarrier,
          to: variables.distributor,
          workflow: variables.workflow,
          credentials: [vc1],
        })
      );
      // services.console.log('output: ', output);
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
    task: ({ variables, output, services }: any) => {
      services.console.log('product shipped to US.');

      const vc1 = services.fake.credential({
        type: 'USImportDeclaration',
        issuer: variables.distributor,
        subject: {
          product: variables.product,
        },
      });

      const vc2 = services.fake.credential({
        type: 'CommercialInvoice',
        issuer: variables.distributor,
        subject: {
          product: variables.product,
        },
      });

      const vc3 = services.fake.credential({
        type: 'AirWaybill',
        issuer: variables.airCarrier,
        subject: {
          product: variables.product,
        },
      });

      output.presentations.push(
        services.fake.presentation({
          from: variables.airCarrier,
          to: variables.customs,
          workflow: variables.workflow,
          credentials: [vc1, vc2, vc3],
        })
      );

      // services.console.log('output: ', output);
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
    task: ({ variables, output, services }: any) => {
      services.console.log('product import approved.');
      // receive presentations of relevant credentials
      // see output.presentations.
      // skipping review here, lets assume all the documents are in order.

      // issue certificate of approval
      const vc1 = services.fake.credential({
        type: 'ImportAproval',
        issuer: variables.customs,
        subject: {
          product: variables.product,
        },
      });

      output.presentations.push(
        services.fake.presentation({
          from: variables.customs,
          to: variables.importer,
          workflow: variables.workflow,
          credentials: [vc1],
        })
      );

      // services.console.log('output: ', output);
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
    task: ({ variables, output, services }: any) => {
      services.console.log('product sold.');

      const vc1 = services.fake.credential({
        type: 'TransparencyCertificate',
        issuer: variables.importer,
        subject: {
          product: variables.product,
          history: output.path,
        },
      });

      output.presentations.push(
        services.fake.presentation({
          from: variables.importer,
          to: variables.importer,
          workflow: variables.workflow,
          credentials: [vc1],
        })
      );

      // services.console.log('output: ', output);
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
