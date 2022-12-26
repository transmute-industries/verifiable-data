



type LeftBranch = {
  left: string
}

type RightBranch = {
  left: string
}

export type MerkleTreeBranch = LeftBranch | RightBranch

export interface MerkleTreeObject {
  root: string;
  leaves: string[];
  paths: string[];
};

export interface SaltedMerkleTree extends MerkleTreeObject {
  members: string[];
  salts: string[];
};

export type MerkleTreeOptions = {
  salts?: Buffer[]
}