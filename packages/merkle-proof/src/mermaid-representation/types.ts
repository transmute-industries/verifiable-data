export type AutographNode = {
  id: string;
  label?: string;
  // 
  isRoot?: boolean;
  isLeaf?: boolean;
};

export type AutographEdge = {
  source: string;
  target: string;
  label?: string;
  //
  fromLeaf: boolean;
  toRoot: boolean;
};

export type Autograph = {
  title?: string;
  nodes: AutographNode[];
  links: AutographEdge[];
};

export type AutographOptions = {
  style?: 'none';
  markdown?: boolean,
  header?: boolean,
  linkStyle: (e: AutographEdge) => string
};