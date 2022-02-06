import { workflow } from '../../diagram/workflow';
import { run } from '../run';

it('can run async', async () => {
  const def = workflow.definition.create({ id: workflow.definition.id() });
  def.addStart({ id: 'StartEvent_0', name: 'Start' });
  def.addTask({
    id: 'Task_0',
    name: 'Async Task',
    task: async (_env: any) => {
      return { foo: 1 };
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
  expect(instance.output.path[1].output).toEqual({ foo: 1 });
});
