const fs = require('fs');
const path = require('path');

import { getModelViewerHtml } from './getModelViewerHtml';

export const handleWorkflowDiagramResponse = (
  argv: any,
  data: any,
  output = './workflow.bpmn'
) => {
  if (argv.debug) {
    if (data.inst) {
      console.log(data.inst);
    }
    if (data.def) {
      fs.writeFileSync(path.resolve(process.cwd(), output), data.xml);
      fs.writeFileSync(
        path.resolve(process.cwd(), output.replace('.bpmn', '.html')),
        getModelViewerHtml()
      );
    }
  } else {
    const fileData =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    fs.writeFileSync(path.resolve(process.cwd(), output), fileData);
  }
};
