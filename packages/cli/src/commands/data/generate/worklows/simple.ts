import { workflow } from '../../../workflow/diagram';

export const getSimpleDefinition = () => {
  const def = workflow.definition.create({ id: workflow.definition.id() });

  def.addStart({ id: 'StartEvent_0', name: 'Begin' });

  def.addTask({
    id: 'Task_0',
    name: 'Issue Certificate of Origin',
    task: ({ variables, output, services }: any) => {
      const { isRadioactive } = variables;
      services.console.log('hello from the other side...');
      output.isRadioactive = isRadioactive;
      return { isRadioactive };
    },
    edges: [
      {
        source: 'StartEvent_0',
        name: 'Begin Import',
      },
    ],
  });

  def.addSwitch({
    id: 'Switch_0',
    name: 'Is Product Radioactive? ',
    edges: [
      {
        source: 'Task_0',
        name: 'Consider Hazards',
      },
    ],
  });

  def.addTask({
    id: 'Task_1',
    name: 'Issue Radioactive Material Package Certificate of Compliance',
    edges: [
      {
        source: 'Switch_0',
        name: 'Yes',
        condition: ({ output }: any) => {
          const { isRadioactive } = output;
          return isRadioactive;
        },
      },
    ],
  });

  def.addTask({
    id: 'Task_2',
    name: 'Present to Importer of Record',
    task: ({ output, services }: any) => {
      services.console.log(
        'importer received presentation of ',
        output.path.length
      );
      return {};
    },
    edges: [
      {
        source: 'Switch_0',
        name: 'No',
        condition: ({ output }: any) => {
          const { isRadioactive } = output;
          return !isRadioactive;
        },
      },
      {
        source: 'Task_1',
        name: 'Submit Documentation',
      },
    ],
  });

  def.addStop({
    id: 'EndEvent_0',
    name: 'End',
    edges: [
      {
        source: 'Task_2',
        name: 'Complete Import',
      },
    ],
  });
  return def;
};
