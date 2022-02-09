import { getModelViewerHtml } from './getModelViewerHtml';

const fs = require('fs');
const path = require('path');

export const handleWorkflowDiagramResponse = (
  argv: any,
  data: any,
  output = './workflow.bpmn'
) => {
  if (argv.debug) {
    if (data.def) {
      console.log(data.def);
    }

    if (data.inst) {
      console.log(data.inst);
    }
  } else {
    if (data.inst) {
      fs.writeFileSync(
        path.resolve(process.cwd(), output),
        JSON.stringify(data.inst, null, 2)
      );
    }
    if (data.def) {
      fs.writeFileSync(path.resolve(process.cwd(), output), data.xml);
      fs.writeFileSync(
        path.resolve(process.cwd(), output.replace('.bpmn', '.html')),
        getModelViewerHtml()
      );
    }
  }
};
