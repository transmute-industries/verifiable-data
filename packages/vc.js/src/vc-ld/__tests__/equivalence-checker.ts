import * as fixtures from '../../__fixtures__';

export const testVendors = (vendors: any[]) => {
  vendors.forEach(async (vendor) => {
    describe(vendor.name, () => {
      const credential = {
        ...fixtures.test_vectors.ld.credentialTemplate,
        issuer: { id: fixtures.unlockedDid.id },
        credentialSubject: {
          ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
          id: fixtures.unlockedDid.id,
        },
      };

      it('issue credential', async () => {
        const credentialIssued = await vendor.vcld.issue({
          credential: { ...credential },
          suite: vendor.suite,
          documentLoader: fixtures.documentLoader,
        });

        expect(credentialIssued).toEqual(
          fixtures.test_vectors.ld.credentialIssued
        );
      });

      it('verify credential', async () => {
        const credentialVerified = await vendor.vcld.verifyCredential({
          credential: { ...fixtures.test_vectors.ld.credentialIssued },
          suite: vendor.suite,
          documentLoader: fixtures.documentLoader,
        });

        expect(credentialVerified).toEqual(
          fixtures.test_vectors.ld.credentialVerified
        );
      });

      it('create presentation', async () => {
        const id = 'ebc6f1c2';
        const holder = 'did:ex:12345';
        const presentationCreated = await vendor.vcld.createPresentation({
          verifiableCredential: {
            ...fixtures.test_vectors.ld.credentialIssued,
          },
          id,
          holder,
          documentLoader: fixtures.documentLoader,
        });
        // console.log(JSON.stringify(presentationCreated, null, 2));
        expect(presentationCreated).toEqual(
          fixtures.test_vectors.ld.presentationCreated
        );
      });

      it('prove presentation', async () => {
        const presentationProved = await vendor.vcld.signPresentation({
          presentation: { ...fixtures.test_vectors.ld.presentationCreated },
          suite: vendor.suite,
          challenge: '123',
          documentLoader: fixtures.documentLoader,
        });

        expect(presentationProved).toEqual(
          fixtures.test_vectors.ld.presentationProved
        );
      });

      it('verify presentation', async () => {
        const presentationVerified = await vendor.vcld.verify({
          presentation: { ...fixtures.test_vectors.ld.presentationProved },
          suite: vendor.suite,
          challenge: '123',
          documentLoader: fixtures.documentLoader,
        });
        //  console.log(JSON.stringify(presentationVerified , null, 2))
        // due to jsonld version driftt, we will only compare boolean results from now on...
        expect(presentationVerified.verified).toEqual(
          fixtures.test_vectors.ld.presentationVerified.verified
        );
      });
    });
  });
};
