import { workflow } from '../../diagram/workflow';
import { run } from '../run';

import { WorkflowEnvironment } from '../types';

it('can use fake actors', async () => {
  const def = workflow.definition.create({ id: workflow.definition.id() });
  def.addStart({ id: 'StartEvent_0', name: 'Start' });
  def.addTask({
    id: 'Task_0',
    name: 'Async Task',
    task: async ({ services }: WorkflowEnvironment) => {
      // make an actor
      const alice = await services.fake.actor.generate({
        type: 'Person',
        seed: 0, // controls identity
      });
      // controls linkability
      const workflow = {
        definition: ['123'],
        instance: ['456'],
      };
      // make a credential
      const vc1 = await alice.credential.generate({
        workflow,
        type: 'CertifiedDevice',
        subject: {
          id: 'did:web:platform.example:devices:123',
        },
      });
      // make a presentation
      const vp1 = await alice.present({
        workflow,
        credentials: [vc1],
      });
      // save to output
      return { vp: vp1 };
    },
    edges: [
      {
        source: 'StartEvent_0',
      },
    ],
  });
  def.addStop({
    id: 'EndEvent_0',
    name: 'End',
    edges: [
      {
        source: 'Task_0',
      },
    ],
  });
  const xml = def.toBpmn();
  const services = {
    console: console,
  };
  const variables = { hello: true };
  const instance = await run('fake-workflow-run', xml, services, variables);
  // console.log(JSON.stringify(instance, null, 2));
  expect(instance.output.path[1].output.vp).toBeDefined();
});
