import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);

describe("merkle urn without salt", () => {
  it("full tree proof", () => {
    const urn = merkle.urn.create({ members });
    expect(urn).toBe(
      "urn:merkle:O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA?X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k=R.a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s~R.qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE&a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s=L.X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k~R.qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE&1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU=R.TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE&TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84=L.1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE&SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o=R.7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450~R.E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U&7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450=L.SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o~R.E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U&5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM=R.eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE~L.qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U&eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE=L.5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM~L.qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q~L.xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U"
    );
    const valid = merkle.urn.validate({ urn });
    expect(valid).toBe(true);
  });
  it("single member proof", () => {
    const fullTreeUrn = merkle.urn.create({ members });
    const proof = merkle.urn.reveal({
      urn: fullTreeUrn,
      reveal: [3],
    });
    expect(proof).toBe(`urn:merkle:O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA?TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84=L.1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU~L.ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU~R.AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE`);
    const valid = merkle.urn.validate({ urn: proof });
    expect(valid).toBe(true);
    const verified = merkle.urn.verify({ urn: proof, value: members[3] });
    expect(verified).toBe(true);
  });
});
