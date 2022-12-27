export type AutographNode = {
  id: string;
  label?: string;
  //
  isRoot?: boolean;
  isLeaf?: boolean;
  isSalt?: boolean;
  isMember?: boolean;
  //
  nodeStyle?: string
};

export type AutographEdge = {
  source: string;
  target: string;
  label?: string;
  //
  fromLeaf?: boolean;
  toRoot?: boolean;
  //
  linkStyle?: string
};

export type Autograph = {
  title?: string;
  nodes: AutographNode[];
  links: AutographEdge[];
};

export type AutographOptions = {
  style?: "transmute";
  markdown?: boolean;
  header?: boolean;
  linkStyle: (e: AutographEdge, i: number, o: AutographOptions) => string;
  nodeStyle: (n: AutographNode, i: number, o: AutographOptions) => string;
};
