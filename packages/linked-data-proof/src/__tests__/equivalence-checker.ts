import * as fixtures from '../__fixtures__';

export const testVendors = (vendors: any[]) => {
  vendors.forEach(async (vendor) => {
    describe(vendor.name, () => {
      it('sign document', async () => {
        const docSigned = await vendor.jsigs.sign(
          { ...fixtures.docTemplate },
          {
            suite: vendor.suite,
            purpose: vendor.purpose,
            documentLoader: fixtures.documentLoader,
          }
        );
        // console.log(JSON.stringify(docSigned, null, 2));
        expect(docSigned).toEqual(fixtures.expected.docSigned);
      });

      it('verify signed document', async () => {
        const docVerified = await vendor.jsigs.verify(
          { ...fixtures.expected.docSigned },
          {
            suite: vendor.suite,
            purpose: vendor.purpose,
            documentLoader: fixtures.documentLoader,
          }
        );
        // console.log(JSON.stringify(docVerified, null, 2));
        expect(docVerified).toEqual(fixtures.expected.docVerified);
      });
    });
  });
};
