export const getNodeProcessFragment = (c: any, g: any) => {
  const childType = `${c.id}`.split('_')[0];

  const outboundLinks = g.links.filter((link: any) => {
    return link.source === c.id;
  });
  const inboundLinks = g.links.filter((link: any) => {
    return link.target === c.id;
  });

  const nodeTypeFactory: any = {
    StartEvent: () => {
      const fragment = `
<bpmn:startEvent id="${c.id}" name="${c.name}">
${outboundLinks
  .map((link: any) => {
    return `<bpmn:outgoing>${link.id}</bpmn:outgoing>`;
  })
  .join('\n')}
</bpmn:startEvent>
          `;
      return fragment;
    },
    Task: () => {
      if (c.task) {
        const taskFunction = c.task.toString();
        let s = `
  
  (async ()=>{
    const {tslib_1} = this.environment.variables;
    const taskFunction = ${taskFunction};
    const invocation = await taskFunction(this.environment);
    const output = invocation;
    next(null, output);
  })()
  
        `;
        c.script = s;
      }
      const fragment = `
<bpmn:scriptTask id="${c.id}" name="${c.name}" scriptFormat="JavaScript">
  <script>
    ${c.script || `next(null, { });`}
  </script>

${inboundLinks
  .map((link: any) => {
    return `<bpmn:incoming>${link.id}</bpmn:incoming>`;
  })
  .join('\n')}

${outboundLinks
  .map((link: any) => {
    return `<bpmn:outgoing>${link.id}</bpmn:outgoing>`;
  })
  .join('\n')}
</bpmn:scriptTask>
        `;
      return fragment;
    },
    Switch: () => {
      const fragment = `
<bpmn:exclusiveGateway id="${c.id}" name="${c.name}">
${inboundLinks
  .map((link: any) => {
    return `<bpmn:incoming>${link.id}</bpmn:incoming>`;
  })
  .join('\n')}

${outboundLinks
  .map((link: any) => {
    return `<bpmn:outgoing>${link.id}</bpmn:outgoing>`;
  })
  .join('\n')}

</bpmn:exclusiveGateway>
        `;
      return fragment;
    },
    EndEvent: () => {
      const fragment = `
<bpmn:endEvent id="${c.id}" name="${c.name}">
${inboundLinks
  .map((link: any) => {
    return `<bpmn:incoming>${link.id}</bpmn:incoming>`;
  })
  .join('\n')}
</bpmn:endEvent>
          `;
      return fragment;
    },
  };

  return nodeTypeFactory[childType]();
};
