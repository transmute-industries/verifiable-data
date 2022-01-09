import MerkleTools from "@settlemint/merkle-tools";

import { sha256, computeTree, generateProof, validateProof } from "..";

const members = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

describe("membership proof", () => {
  for (let i = 0; i < members.length; i++) {
    describe(`proof for ${members[0]} - ${members[i]}`, () => {
      const memberSet = members.slice(0, i + 1).map(m => {
        return Buffer.from(m);
      });

      const memberHashes = memberSet.map(m => {
        return sha256(Buffer.from(m));
      });
      const merkleTools = new MerkleTools(); // no options, defaults to sha-256 hash type
      memberHashes.forEach(m => {
        merkleTools.addLeaf(m);
      });
      merkleTools.makeTree();
      const root1 = merkleTools.getMerkleRoot() as any;
      const tree = computeTree(memberSet);
      const root2 = tree[0][0] || null;
      it("roots should match", () => {
        expect(root1).toEqual(root2);
      });

      memberSet.forEach((m, i) => {
        it(`${members[i]} is in ${root1.toString("hex")}`, () => {
          const proof1 = merkleTools.getProof(i) as any;
          const isProof1Valid = merkleTools.validateProof(
            proof1,
            memberHashes[i],
            root1
          );
          expect(isProof1Valid).toBe(true);
          const proof2 = generateProof(m, tree);
          const isProof2Valid = validateProof(m, proof2, root2);
          expect(isProof2Valid).toBe(true);
          expect(proof1).toEqual(
            proof2?.map((p: any) => {
              return p.left
                ? { left: p.left.toString("hex") }
                : { right: p.right.toString("hex") };
            })
          );
        });
      });
    });
  }
});
