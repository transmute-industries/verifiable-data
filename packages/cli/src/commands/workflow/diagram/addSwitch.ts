import { getNodeProcessFragment } from './getNodeProcessFragment';
import insertBeforeClosingTag from './insertBeforeClosingTag';
import { tn } from './constants';
import { addNodeShape } from './addNodeShape';

const addSwitch = (definition: any, options: any, g: any) => {
  let modifiedDefinition = `${definition}`;

  let x = options.number * 200;

  const c = {
    id: options.id,
    name: options.name,
    x: x,
    y: tn.y,
    w: 100,
    h: 100,
  };

  const processNodeFragment = getNodeProcessFragment(c, g);

  modifiedDefinition = insertBeforeClosingTag(
    modifiedDefinition,
    processNodeFragment,
    '</bpmn:process>'
  );

  modifiedDefinition = addNodeShape(modifiedDefinition, c);

  return { definition: modifiedDefinition, node: c };
};

export default addSwitch;
