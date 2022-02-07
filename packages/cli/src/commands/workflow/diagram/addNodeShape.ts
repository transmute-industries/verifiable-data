import insertBeforeClosingTag from './insertBeforeClosingTag';

export const addNodeShape = (definition: string, c: any) => {
  let modifiedDefinition = `${definition}`;

  const sly = c.y - c.h / 1.5;
  const shapeFragment = `
<bpmndi:BPMNShape id="${c.id}_di" bpmnElement="${c.id}">
  <dc:Bounds x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" />

  <bpmndi:BPMNLabel>
    <dc:Bounds x="${c.x}" y="${sly}" width="${c.w}" height="${c.h}" />
  </bpmndi:BPMNLabel>
</bpmndi:BPMNShape>
          `;

  modifiedDefinition = insertBeforeClosingTag(
    modifiedDefinition,
    shapeFragment,
    '</bpmndi:BPMNPlane>'
  );
  return modifiedDefinition;
};
