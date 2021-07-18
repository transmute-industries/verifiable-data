type HolderId = string;

interface HolderNode {
  id: string;
  [x: string]: any;
}

export type Holder = HolderId | HolderNode;
