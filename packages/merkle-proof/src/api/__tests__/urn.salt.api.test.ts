import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
const seed = Buffer.from("hello");
const salts = merkle.salt.from(members, seed);

describe("merkle urn with salt", () => {
  it("full tree proof", () => {
    const urn = merkle.urn.create({ members, salts });
    expect(urn).toBe(
      "urn:merkle:_O7ZptDk-KKRBMb5IChJLNvbspr1Pyo3GsUTjdEpZ5Y?B578USAhSWeh7OB1b02pTQA8jlEJVKpCKrsMuKkVgDM.WpNu4ZoM88cNjLAAYRG3pS9F7AFwPgr4zcjG2BrFhQw=R.pciCJqqefE0tMRHMvBLzkqpDFaJh3VwoNxHaa7QDbfs~R.eX7WGq8vtwdIVf2Lx58lSNSRGd6m3GGC0qIKCzBCcZM~R.oQtWuqlYedaQf0HaYrsfftMb7O6GtMO8SNpTSF1wKFQ&pciCJqqefE0tMRHMvBLzkqpDFaJh3VwoNxHaa7QDbfs.kekkD0FSI5gu3DRVMmMHEOlKf1LNX0j17hr8VVB48Ks=L.B578USAhSWeh7OB1b02pTQA8jlEJVKpCKrsMuKkVgDM~R.eX7WGq8vtwdIVf2Lx58lSNSRGd6m3GGC0qIKCzBCcZM~R.oQtWuqlYedaQf0HaYrsfftMb7O6GtMO8SNpTSF1wKFQ&ewLQJ-MF4W9Qegf7vAv9vb573djdvUFz2Y4FmBnc7KY.hymMwvMfunMYHqKp5u8Q3OIe2V6YvaycThUE6hb0huQ=R.YMsWof5deBcACWaDH51SaAPuvetpCV4Wv0npthB9KQs~L.1z8VtbsA1IlT9I3aUA3iDA4idPjLUuMNbUFO2qU7AqM~R.oQtWuqlYedaQf0HaYrsfftMb7O6GtMO8SNpTSF1wKFQ&YMsWof5deBcACWaDH51SaAPuvetpCV4Wv0npthB9KQs.R-pwzwiHK9tK-tNDKwHZY6x9Fl9rV1zXLvR0mPRFmpA=L.ewLQJ-MF4W9Qegf7vAv9vb573djdvUFz2Y4FmBnc7KY~L.1z8VtbsA1IlT9I3aUA3iDA4idPjLUuMNbUFO2qU7AqM~R.oQtWuqlYedaQf0HaYrsfftMb7O6GtMO8SNpTSF1wKFQ&iXvw0qV1d2tMiN8_7Btkbiufs_VDzR56BBV5GtwA3rc.42GlenQGre5lPx3P9mDYTwyjApB3R68qOH9nghrPzjM=R.ZCe4exZwVMPfdWpSvuoAutu1UIABUvSa7vM7nAwa5h4~R.ymgzM-AaNOIiJ_U_hfPmcD8W19iTJoKhU1D71wJonXs~L.J_R8UsFrhydO_FMCDSM6HYl7AycNw4Z3gTAOYRA4C1Q&ZCe4exZwVMPfdWpSvuoAutu1UIABUvSa7vM7nAwa5h4.jf6C2acq2DHkjlJKOK0RHyBu8Iw5qlhH2ybfA07jtX0=L.iXvw0qV1d2tMiN8_7Btkbiufs_VDzR56BBV5GtwA3rc~R.ymgzM-AaNOIiJ_U_hfPmcD8W19iTJoKhU1D71wJonXs~L.J_R8UsFrhydO_FMCDSM6HYl7AycNw4Z3gTAOYRA4C1Q&Uqoj5mowSWBXmIliElD7-UXfsyMCKCqeCk53BWshQ64.GWNzMQgnZpy1j0xojrJ6q8QOYA3JhhW9Mp9BCrdDDP8=R.ICy2ade6u7B_ckUNGDKam7NvRYnBy0-ixCzzW41bous~L.ejZAcfEB2t5sJab2288ELQ0aPugmjTRsd4ZgAaNUR08~L.J_R8UsFrhydO_FMCDSM6HYl7AycNw4Z3gTAOYRA4C1Q&ICy2ade6u7B_ckUNGDKam7NvRYnBy0-ixCzzW41bous.XZ2tFnCTciAJCO7LamdUG6QBO_dJDMtA2LdYMqG0rKA=L.Uqoj5mowSWBXmIliElD7-UXfsyMCKCqeCk53BWshQ64~L.ejZAcfEB2t5sJab2288ELQ0aPugmjTRsd4ZgAaNUR08~L.J_R8UsFrhydO_FMCDSM6HYl7AycNw4Z3gTAOYRA4C1Q"
    );
    const valid = merkle.urn.validate({ urn });
    expect(valid).toBe(true);
  });
  it("single member proof", () => {
    const fullTreeUrn = merkle.urn.create({ members, salts });
    const proof = merkle.urn.reveal({
      urn: fullTreeUrn,
      reveal: [3],
    });
    expect(proof).toBe(`urn:merkle:_O7ZptDk-KKRBMb5IChJLNvbspr1Pyo3GsUTjdEpZ5Y?YMsWof5deBcACWaDH51SaAPuvetpCV4Wv0npthB9KQs.R-pwzwiHK9tK-tNDKwHZY6x9Fl9rV1zXLvR0mPRFmpA=L.ewLQJ-MF4W9Qegf7vAv9vb573djdvUFz2Y4FmBnc7KY~L.1z8VtbsA1IlT9I3aUA3iDA4idPjLUuMNbUFO2qU7AqM~R.oQtWuqlYedaQf0HaYrsfftMb7O6GtMO8SNpTSF1wKFQ`);
    const valid = merkle.urn.validate({ urn: proof });
    expect(valid).toBe(true);
    const verified = merkle.urn.verify({ urn: proof, value: members[3], salt: salts[3] });
    expect(verified).toBe(true);
  });
});
