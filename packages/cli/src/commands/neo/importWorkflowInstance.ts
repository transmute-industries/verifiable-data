import { getWorkflowInstanceFromFile } from '../../util/getWorkflowInstanceFromFile';

import { getDriver } from './utils/getDriver';

const addVp = async (vp: any, driver: any) => {
  const session = driver.session();

  await session.run(
    `
    MERGE (n:VerifiablePresentation { id: '${vp.id}'})
    `
  );
  await session.close();
};

const addDef = async (defId: any, vpId: any, driver: any) => {
  const session = driver.session();
  await session.run(
    `
    MERGE (n:WorkflowDefinition { id: '${defId}'})
    `
  );
  await session.run(
    `
MATCH
  (s {id: '${vpId}'}),
  (o {id: '${defId}'})
MERGE (s)-[:definition]->(o)
RETURN s`
  );
  await session.close();
};

const addInst = async (instId: any, vpId: any, driver: any) => {
  const session = driver.session();
  await session.run(
    `
    MERGE (n:WorkflowInstance { id: '${instId}'})
    `
  );
  await session.run(
    `
MATCH
  (s {id: '${vpId}'}),
  (o {id: '${instId}'})
MERGE (s)-[:instance]->(o)
RETURN s`
  );
  await session.close();
};

const addCredential = async (vc: any, vp: any, driver: any) => {
  const session = driver.session();
  await session.run(
    `
        MERGE (n:VerifiableCredential { id: '${vc.id}', name: '${
      vc.type[vc.type.length - 1]
    }'})
        `
  );
  await session.run(
    `
    MATCH
      (s {id: '${vp.id}'}),
      (o {id: '${vc.id}'})
    MERGE (s)-[:discloses]->(o)
    RETURN s`
  );
  await session.close();
};

const addPresentation = async (vp: any, driver: any) => {
  await addVp(vp, driver);

  if (vp.workflow) {
    if (vp.workflow.definition) {
      for (const defId of vp.workflow.definition) {
        await addDef(defId, vp.id, driver);
      }
    }

    if (vp.workflow.instance) {
      for (const instId of vp.workflow.instance) {
        await addInst(instId, vp.id, driver);
      }
    }
  }

  for (const vc of vp.verifiableCredential) {
    await addCredential(vc, vp, driver);
  }
};

export const importWorkflowInstance = async (instance: any, driver: any) => {
  for (const vp of instance.output.presentations) {
    await addPresentation(vp, driver);
  }

  console.log('work completed.');

  await driver.close();
};

export const importWorkflowHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  let instance: any = {};
  const driver = getDriver(argv.uri, argv.user, argv.password);

  if (argv.clean) {
    const session = driver.session();

    await session.run(
      `
    MATCH (n)
    DETACH DELETE n;
    `
    );
    await session.close();
  }
  if (argv.input) {
    instance = getWorkflowInstanceFromFile(argv.input);
  }
  await importWorkflowInstance(instance, driver);
  await driver.close();
};
