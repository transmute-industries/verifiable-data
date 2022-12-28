import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
const seed = Buffer.from("hello");
const salts = merkle.salt.from(members, seed);

describe("merkle mermaid", () => {
  it("full tree proof", () => {
    const urn = merkle.urn.create({ members, salts });
    const m0 = merkle.mermaid.urn.create({ urn });
    console.log(m0)
  });
});
