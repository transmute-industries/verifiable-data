import JsonMerkleTree from "../json-representation";
import { fullTreeObjectToFullTreeGraph } from "./fullTreeObjectToFullTreeGraph";
import { graphToMermaid } from "./graphToMermaid";
import { defaults } from "./defaults";

const defaultsBasicTreeOptions: any = {
  header: true,
  markdown: true,
  style: "none",
  linkStyle: defaults.linkStyle,
  nodeStyle: defaults.nodeStyle
};

export const basicTree = (
  members: Buffer[],
  optionOverride: any = defaultsBasicTreeOptions
) => {
  const fullTreeObject = JsonMerkleTree.from(members);
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  const options: any = {
    ...defaultsBasicTreeOptions,
    ...optionOverride
  };
  return graphToMermaid(fullTreeGraph, options);
};
