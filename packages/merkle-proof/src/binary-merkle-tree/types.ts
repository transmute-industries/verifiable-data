export enum SiblingPosition {
  left = "left",
  right = "right"
}

export type Sibling = {
  [SiblingPosition.left]?: Buffer;
  [SiblingPosition.right]?: Buffer;
};

export type MerkleAuditPath = Array<Sibling>;

export type HashFunction = (data: Buffer) => Buffer;
