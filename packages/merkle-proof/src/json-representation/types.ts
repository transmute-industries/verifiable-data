type LeftBranch = {
  left: string;
};

type RightBranch = {
  left: string;
};

export type MerkleTreeBranch = LeftBranch | RightBranch;

// TODO: fix type
export interface MerkleTreeObject {
  root: string;
  paths: string[];
  leaves: string[];
  members: string[];
}

export interface SaltedMerkleTree extends MerkleTreeObject {
  salts: string[];
}

export type MerkleTreeOptions = {
  salts?: Buffer[];
};
