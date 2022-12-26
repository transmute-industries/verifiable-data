
import JsonMerkleTree from '../json-representation'
import {fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'
import { graphToMermaid } from './graphToMermaid'
import { defaults } from './defaults'

export const basicTree = (members: Buffer[]) =>{
  const fullTreeObject = JsonMerkleTree.from(members)
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject)
  const options: any = { 
    header: true, 
    markdown: true, 
    style: 'none', 
    linkStyle: defaults.linkStyle,
    nodeStyle: defaults.nodeStyle
  };
  return graphToMermaid(fullTreeGraph, options)
  
}