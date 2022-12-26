import { Autograph  } from './types'

import { graphToMermaid } from './graphToMermaid';

export const fromGraphs = (graphs: Autograph[]) => { 
  const items = graphs.map((g, i)=>{
    return graphToMermaid(g, { header: i===0, markdown: false })
  })
  return items.join('\n')
}