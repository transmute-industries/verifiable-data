import insertBeforeClosingTag from './insertBeforeClosingTag';

export const addDiagramEdge = (modifiedDefinition: any, link: any) => {
  const waypoints: any = [];

  //   waypoints.push(`<di:waypoint x="${p.x + p.w}" y="${p.y}" />`);
  //   waypoints.push(`<di:waypoint x="${c.x}" y="${c.y}" />`);

  const edgeFragment = `
    <bpmndi:BPMNEdge id="${link.id}_di" bpmnElement="${link.id}">
      ${waypoints.join('\n')}
    </bpmndi:BPMNEdge>
  `;

  return insertBeforeClosingTag(
    modifiedDefinition,
    edgeFragment,
    '</bpmndi:BPMNPlane>'
  );
};
