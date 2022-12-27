import BinaryMerkleTree from "..";

const list: Buffer[] = Array.from({ length: 512 }, (_x, i) =>
  Buffer.from(`${i}`)
);

it("large", () => {
  const members = list;
  const targetIndex = 123;
  const tree = BinaryMerkleTree.computeTree(members);
  const auditPath = BinaryMerkleTree.createMerkleAuditPath(
    members[targetIndex],
    tree
  );
  const targetHash = BinaryMerkleTree.sha256(members[targetIndex]);
  const valid = BinaryMerkleTree.validateMerkleAuditPath(
    targetHash,
    auditPath,
    tree[0][0]
  );
  expect(valid).toBe(true);
});
