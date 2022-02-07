import insertBeforeClosingTag from './insertBeforeClosingTag';

export const addSequenceFlow = (definition: any, link: any) => {
  let modifiedDefinition = `${definition}`;
  let conditions = ``;

  if (link.source.includes('Switch')) {
    if (link.condition) {
      let s = `
const condition = (${link.condition.toString()})(this.environment);
next(null, condition);
      `;

      link.script = s;
    }

    conditions = `<bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">${link.script}</bpmn:conditionExpression>`;
  }
  const edgeFragment = `
<bpmn:sequenceFlow 
id="${link.id}" 
name="${link.name}"
sourceRef="${link.source}" 
targetRef="${link.target}">
${conditions}
</bpmn:sequenceFlow>
      `;

  modifiedDefinition = insertBeforeClosingTag(
    modifiedDefinition,
    edgeFragment,
    '</bpmn:process>'
  );

  return modifiedDefinition;
};
