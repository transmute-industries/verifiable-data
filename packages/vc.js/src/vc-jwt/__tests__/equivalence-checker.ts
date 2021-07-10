import jose from 'jose';
import * as fixtures from '../../__fixtures__';

const signerFactory = (controller: string, jwk: any) => {
  return {
    sign: (payload: object, header: any) => {
      // typ: 'JWT', MUST NOT be present per well known did configuration...
      header.kid = controller + jwk.kid;
      return jose.JWS.sign(payload, jose.JWK.asKey(jwk), header);
    },
  };
};

const verifyFactory = (jwk: any) => {
  return {
    verify: (jws: string) => {
      const verified = jose.JWS.verify(jws, jose.JWK.asKey(jwk), {
        complete: true,
      });
      delete verified.key;
      return verified;
    },
  };
};

export const testVendors = (vendors: any[]) => {
  vendors.forEach(async (vendor) => {
    if (!vendor.jwt) {
      return;
    } else {
      const signer = signerFactory(
        'did:example:123',
        fixtures.unlockedDid.publicKey[1].privateKeyJwk
      );
      const verifier = verifyFactory(
        fixtures.unlockedDid.publicKey[1].publicKeyJwk
      );
      vendor.signer = signer;
      vendor.verifier = verifier;
    }

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
        const credentialIssued = await vendor.vcjwt.issue(
          credential,
          vendor.signer,
          fixtures.documentLoader
        );
        expect(credentialIssued).toBe(
          fixtures.test_vectors.jwt.credentialIssued
        );
      });

      it('verify credential', async () => {
        const credentialVerified = await vendor.vcjwt.verify(
          fixtures.test_vectors.jwt.credentialIssued,
          vendor.verifier,
          fixtures.documentLoader
        );
        expect(credentialVerified).toEqual(
          fixtures.test_vectors.jwt.credentialVerified
        );
      });

      it('create presentation', async () => {
        const presentationCreated = await vendor.vcjwt.createPresentation(
          [fixtures.test_vectors.jwt.credentialIssued],
          'did:example:456'
        );

        expect(presentationCreated).toEqual(
          fixtures.test_vectors.jwt.presentationCreated
        );
      });

      it('prove presentation', async () => {
        const presentationProved = await vendor.vcjwt.provePresentation(
          fixtures.test_vectors.jwt.presentationCreated,
          vendor.vpOptions,
          vendor.signer
        );
        expect(presentationProved).toEqual(
          fixtures.test_vectors.jwt.presentationProved
        );
      });

      it('verify presentation', async () => {
        const presentationVerified = await vendor.vcjwt.verify(
          fixtures.test_vectors.jwt.presentationProved,
          vendor.verifier
        );
        expect(presentationVerified).toEqual(
          fixtures.test_vectors.jwt.presentationVerified
        );
      });
    });
  });
};
