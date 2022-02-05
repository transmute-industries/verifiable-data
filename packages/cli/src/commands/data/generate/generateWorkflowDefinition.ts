import faker from 'faker';
import { workflow } from '../../workflow/diagram';

// import { getSimpleDefinition } from './worklows/simple';
import { generateECommerceFlow } from './worklows/ecommerce';

const generateDefinitons = (size = 3) => {
  const definitions = [];
  for (let i = 0; i < size; i++) {
    definitions.push(
      workflow.definition.create({ id: workflow.definition.id() })
    );
  }
  return definitions;
};

const getInstances = (def: any) => {
  const numberOfInstances = faker.datatype.number({
    min: 3,
    max: 5,
  });
  const instances = [];
  for (let i = 0; i < numberOfInstances; i++) {
    instances.push(
      workflow.instance.create({
        id: workflow.instance.id(),
        definition: def.id,
      })
    );
  }
  return instances;
};

const getPresentations = (instance: any) => {
  const numberOfPresenations = faker.datatype.number({
    min: 1,
    max: 4,
  });

  const presentations = [];
  for (let i = 0; i < numberOfPresenations; i++) {
    const numberOfCredentials = faker.datatype.number({
      min: 1,
      max: 3,
    });
    const verifiableCredential = [];
    for (let j = 0; j < numberOfCredentials; j++) {
      verifiableCredential.push(
        instance.annotateCredential({
          id: workflow.instance.id(),
          type: [
            'VerifiableCredential',
            faker.commerce.product() + ' Certificate',
          ],
        })
      );
    }
    presentations.push(
      instance.annotatePresentation({
        id: workflow.instance.id(),
        type: ['VerifiablePresentation'],
        verifiableCredential,
      })
    );
  }
  return presentations;
};

export const getInstanceData = (size = 3) => {
  const definitions = generateDefinitons(size);
  let totalPresentations: any = [];
  for (const definition of definitions) {
    const instances = getInstances(definition);
    for (const instance of instances) {
      const presentations = getPresentations(instance);
      totalPresentations = [...totalPresentations, ...presentations];
    }
  }
  const workflow2 = workflow.instance.create({
    id: 'All Presentations',
  });
  totalPresentations.forEach((vp: any) => {
    workflow2.addPresentation(vp);
  });

  return workflow2.toJson();
};

export const generateWorkflowDefinition = (
  _argv: any,
  _typeGenerators: any
) => {
  const def = generateECommerceFlow();
  const xml = def.toBpmn();
  const json = def.toJson();
  const result = { def, xml, json };
  return result;
};
