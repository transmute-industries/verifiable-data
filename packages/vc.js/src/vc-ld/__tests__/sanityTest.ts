import * as fixtures from '../../__fixtures__';
const vc = require('vc-js');

const { documentLoader } = fixtures;

const credential = {
  ...fixtures.test_vectors.ld.credentialTemplate,
  issuer: { id: fixtures.unlockedDid.id },
  credentialSubject: {
    ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
    id: fixtures.unlockedDid.id,
  },
};

export const runTests = (suite: any) => {
  let verifiableCredential: any;
  let verifiablePresentation: any;

  it('issue verifiableCredential', async () => {
    verifiableCredential = await vc.issue({
      credential: { ...credential },
      suite,
      documentLoader,
    });
    expect(verifiableCredential.proof).toBeDefined();
  });

  it('verify verifiableCredential', async () => {
    // console.log(JSON.stringify(verifiableCredential, null, 2));
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      suite,
      documentLoader,
    });
    // console.log(JSON.stringify(result, null, 2));
    expect(result.verified).toBe(true);
  });

  it('createPresentation & signPresentation', async () => {
    const id = 'ebc6f1c2';
    const holder = 'did:ex:12345';
    const presentation = await vc.createPresentation({
      verifiableCredential,
      id,
      holder,
    });
    expect(presentation.type).toEqual(['VerifiablePresentation']);
    verifiablePresentation = await vc.signPresentation({
      presentation,
      suite,
      challenge: '123',
      documentLoader,
    });
    expect(verifiablePresentation.proof).toBeDefined();
  });

  it('verify verifiablePresentation', async () => {
    const result = await vc.verify({
      presentation: verifiablePresentation,
      challenge: '123',
      suite,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });
};
