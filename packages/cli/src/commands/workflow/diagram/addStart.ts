import insertBeforeClosingTag from './insertBeforeClosingTag';

import { tn } from './constants';
import { getNodeProcessFragment } from './getNodeProcessFragment';
import { addNodeShape } from './addNodeShape';
const addStart = (definition: any, options: any, g: any) => {
  let modifiedDefinition = `${definition}`;

  const c = {
    id: options.id,
    name: options.name,
    x: tn.x,
    y: tn.y,
    w: tn.w,
    h: tn.h,
  };
  const startEvent = getNodeProcessFragment(c, g);

  const processFragment = `
<bpmn:process id="Process_0" isExecutable="true">
${startEvent}
</bpmn:process>
    `;

  modifiedDefinition = insertBeforeClosingTag(
    modifiedDefinition,
    processFragment,
    '</bpmn:definitions>'
  );

  const diagramFragment = `
  <bpmndi:BPMNDiagram id="Diagram_0">
    <bpmndi:BPMNPlane id="Plane_0" bpmnElement="Process_0">

 
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
        `;

  modifiedDefinition = insertBeforeClosingTag(
    modifiedDefinition,
    diagramFragment,
    '</bpmn:definitions>'
  );

  modifiedDefinition = addNodeShape(modifiedDefinition, c);

  return { definition: modifiedDefinition, node: c };
};

export default addStart;
