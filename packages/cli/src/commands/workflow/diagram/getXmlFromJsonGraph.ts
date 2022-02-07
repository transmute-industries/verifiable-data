import createDefinition from './createDefinition';

import addStart from './addStart';

import addTask from './addTask';
import addSwitch from './addSwitch';
import addEnd from './addEnd';

import { addSequenceFlow } from './addSequenceFlow';
import { addDiagramEdge } from './addDiagramEdge';

const getXmlFromJsonGraph = (gp: any) => {
  let def = createDefinition('new-process-diagram');
  gp.nodes.forEach((n: any) => {
    if (n.type === 'Start') {
      const res = addStart(def, n, gp);
      def = res.definition;
    }

    if (n.type === 'Task') {
      const res = addTask(def, n, gp);
      def = res.definition;
    }

    if (n.type === 'Switch') {
      const res = addSwitch(def, n, gp);
      def = res.definition;
    }

    if (n.type === 'Stop') {
      const res = addEnd(def, n, gp);
      def = res.definition;
    }
  });

  gp.links.forEach((link: any) => {
    def = addSequenceFlow(def, link);
    def = addDiagramEdge(def, link);
  });

  return def;
};

export default getXmlFromJsonGraph;
