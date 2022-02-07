const emptyFile = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    id="NEW_DEFINITION_ID"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    targetNamespace="http://bpmn.io/schema/bpmn">

</bpmn:definitions>
    `;
const createDefinition = (id: string, file = emptyFile) => {
  return file.replace('NEW_DEFINITION_ID', id);
};

export default createDefinition;
