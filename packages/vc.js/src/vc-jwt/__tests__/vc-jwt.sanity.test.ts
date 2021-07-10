import jose from 'jose';
import { JsonWebKey } from '@transmute/json-web-key-2020';

import * as fixtures from '../../__fixtures__';
import * as vcJwt from '../index';

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

describe('vc-jwt', () => {
  let key: JsonWebKey;
  it('sanity', async () => {
    key = await JsonWebKey.generate();
    // console.log(JSON.stringify(key, null, 2))
    const signer = signerFactory('did:example:123', key.privateKeyJwk);
    const verifier = verifyFactory(key.publicKeyJwk);
    const jwsVc = await vcJwt.issue(
      fixtures.test_vectors.ld.credentialTemplate,
      signer,
      fixtures.documentLoader
    );
    const verifiedVc = vcJwt.verify(jwsVc, verifier);
    expect(verifiedVc.protected.alg).toBe('EdDSA');
    expect(verifiedVc.protected.kid).toBeDefined();
    const vp = await vcJwt.createPresentation([jwsVc], 'did:example:456');
    const vpOptions = {
      domain: 'verifier.com',
      challenge: '7cec01f7-82ee-4474-a4e6-feaaa7351e48',
    };
    const jwsVp = vcJwt.provePresentation(vp, vpOptions, signer);
    const verifiedVp = vcJwt.verify(jwsVp, verifier);
    expect(verifiedVp.protected.alg).toBe('EdDSA');
    expect(verifiedVp.protected.kid).toBeDefined();
    expect(verifiedVp.payload.nonce).toBe(vpOptions.challenge);
    expect(verifiedVp.payload.aud).toBe(vpOptions.domain);
  });

  it('should fail if credential is not valid json ld', async () => {
    expect.assertions(2);
    key = await JsonWebKey.generate();
    const signer = signerFactory('did:example:123', key.privateKeyJwk);
    try {
      await vcJwt.issue(
        fixtures.test_vectors.ld.credentialTemplateInvalidMissingProperty,
        signer,
        fixtures.documentLoader
      );
    } catch (e) {
      expect(e.message).toContain('MISSING_PROPERTIES_IN_CONTEXT');
    }

    try {
      await vcJwt.issue(
        fixtures.test_vectors.ld.credentialTemplateInvalidNoContext,
        signer,
        fixtures.documentLoader
      );
    } catch (e) {
      expect(e.message).toContain('jsonld.SyntaxError');
    }
  });
});
