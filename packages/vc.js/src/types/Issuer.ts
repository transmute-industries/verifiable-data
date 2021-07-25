type IssuerId = string;

interface IssuerNode {
  id: string;
  [x: string]: any;
}

export type Issuer = IssuerId | IssuerNode;
