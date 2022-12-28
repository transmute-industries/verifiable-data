import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);

describe("merkle object without salt", () => {
  it("full tree proof", () => {
    const proof = merkle.object.create({ members });
    expect(proof).toEqual({
      root: "O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA",
      paths: [
        "R.a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s~R.qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE",
        "L.X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k~R.qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE",
        "R.TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE",
        "L.1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE",
        "R.7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450~R.E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U",
        "L.SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o~R.E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U",
        "R.eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE~L.qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U",
        "L.5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM~L.qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U"
      ],
      leaves: [
        "X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k",
        "a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s",
        "1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU",
        "TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84",
        "SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o",
        "7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450",
        "5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM",
        "eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE"
      ]
    });
    const valid = merkle.object.validate({ proof });
    expect(valid).toBe(true);
  });
  it("single member proof", () => {
    const fullTreeProof = merkle.object.create({ members });
    const proof = merkle.object.reveal({
      proof: fullTreeProof,
      reveal: [3]
    });
    expect(proof).toEqual({
      root: "O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA",
      paths: [
        "L.1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE"
      ],
      leaves: ["TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84"]
    });
    const valid = merkle.object.validate({ proof });
    expect(valid).toBe(true);
    const verified = merkle.object.verify({ proof, value: members[3] });
    expect(verified).toBe(true);
  });
});
