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
  leaves: string[]; // either hash of member, or hash of member + salt.
  salts?: string[];
}

export type MerkleTreeOptions = {
  salts?: Buffer[];
};
