export type AutographNode = {
  id: string;
  label?: string;
};

export type AutographEdge = {
  source: string;
  target: string;
  label?: string;
};

export type Autograph = {
  title?: string;
  nodes: AutographNode[];
  links: AutographEdge[];
};

export type AutographOptions = {
  style?: 'none';
  markdown?: boolean,
  header?: boolean
};