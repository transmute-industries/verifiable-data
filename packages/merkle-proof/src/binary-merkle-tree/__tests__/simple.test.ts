import BinaryMerkleTree from '..'

it('simple', () => {
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)
  const tree = BinaryMerkleTree.computeTree(members);
  const auditPath = BinaryMerkleTree.createMerkleAuditPath(members[0], tree);
  const valid = BinaryMerkleTree.validateMerkleAuditPath(members[0], auditPath, tree[0][0])
  expect(valid).toBe(true)
})