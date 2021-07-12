/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {
  createList,
  decodeList,
  createCredential,
  CONTEXTS,
  checkStatus,
  statusTypeMatches,
  assertRevocationList2020Context,
  getCredentialStatus,
} from '..';

import {
  encodedList100k,
  revocationListCredential,
  documentLoader,
} from '../__fixtures__';

import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';

describe('vc-status-rl-2020', () => {
  it('should create a list', async () => {
    const list = await createList({ length: 8 });
    expect(list.length).toBe(8);
  });

  it('should fail to create a list if no length', async () => {
    try {
      await (createList as any)();
    } catch (e) {
      expect(e.name).toBe('TypeError');
    }
  });

  it('should decode a list', async () => {
    const list = await decodeList({ encodedList: encodedList100k });
    expect(list.length).toBe(100000);
  });

  it('should create a RevocationList2020Credential credential', async () => {
    const id = 'https://example.com/status/1';
    const list = await createList({ length: 100000 });
    const credential = await createCredential({ id, list });
    expect(credential).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id,
      type: ['VerifiableCredential', 'RevocationList2020Credential'],
      credentialSubject: {
        id: `${id}#list`,
        type: 'RevocationList2020',
        encodedList: encodedList100k,
      },
    });
  });

  it('should indicate that the status type matches', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListIndex: '67342',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = statusTypeMatches({ credential });
    expect(result).toBe(true);
  });

  it('should indicate that the status type does not match', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'NotMatch',
        revocationListIndex: '67342',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = statusTypeMatches({ credential });
    expect(result).toBe(false);
  });

  it('should verify the status of a credential', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListIndex: '67342',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = await checkStatus({
      credential,
      documentLoader,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(true);
  });

  it('should fail to verify status with incorrect status type', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'ex:NonmatchingStatusType',
        revocationListIndex: '67342',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = await checkStatus({
      credential,
      documentLoader,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(false);
  });

  it('should fail to verify status with missing index', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = await checkStatus({
      credential,
      documentLoader,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(false);
  });

  it('should fail to verify status with missing list credential', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListIndex: '67342',
      },
    };
    const result = await checkStatus({
      credential,
      documentLoader,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(false);
  });

  it('should fail to verify status for revoked credential', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:e74fb1d6-7926-11ea-8e11-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:011e064e-7927-11ea-8975-10bf48838a41',
        'example:test': 'bar',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#50000',
        type: 'RevocationList2020Status',
        revocationListIndex: '50000',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const result = await checkStatus({
      credential,
      documentLoader,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(false);
  });

  it('should fail to verify status on missing "credential" param', async () => {
    let result = await checkStatus({
      documentLoader,
      verifyRevocationListCredential: false,
    } as any);
    expect(result.verified).toBe(false);
    if (result.error) {
      expect(result.error.name).toBe('TypeError');
      expect(result.error.message).toBe('"credential" must be an object.');
    }
  });

  it(
    'should fail to verify if credential is not an object for ' +
      'statusTypeMatches"',
    async () => {
      try {
        statusTypeMatches({ credential: '' });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"credential" must be an object.');
      }
    }
  );

  it(
    'should fail to verify if credential is not an object for ' +
      '"assertRevocationList2020Context"',
    async () => {
      try {
        assertRevocationList2020Context({ credential: '' });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"credential" must be an object.');
      }
    }
  );

  it(
    'should fail to verify if credential is not an object for ' +
      '"getCredentialStatus"',
    async () => {
      try {
        getCredentialStatus({ credential: '' });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"credential" must be an object.');
      }
    }
  );

  it(
    'should fail to verify if @context is not an array in ' +
      '"statusTypeMatches"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      try {
        // change the @context property to a string
        credential['@context'] = id;
        statusTypeMatches({ credential });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"@context" must be an array.');
      }
    }
  );

  it(
    'should fail when the first "@context" value is unexpected in ' +
      'statusTypeMatches"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential = await createCredential({ id, list });
      try {
        // change the @context property intentionally to an unexpected value
        credential['@context'][0] = 'https://example.com/test/1';
        statusTypeMatches({ credential });
      } catch (e) {
        expect(e.name).toBe('Error');
        expect(e.message).toBe(
          'The first "@context" value must be "https://www.w3.org/2018/credentials/v1".'
        );
      }
    }
  );

  it(
    'should fail to verify if @context is not an array in ' +
      '"assertRevocationList2020Context"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      try {
        // change the @context property to a string
        credential['@context'] = 'https://example.com/status/1';
        assertRevocationList2020Context({ credential });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe('"@context" must be an array.');
      }
    }
  );

  it(
    'should fail when the first "@context" value is unexpected in' +
      '"assertRevocationList2020Context"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential = await createCredential({ id, list });
      try {
        // change the @context property intentionally to an unexpected value
        credential['@context'][0] = 'https://example.com/test/1';
        assertRevocationList2020Context({ credential });
      } catch (e) {
        expect(e.name).toBe('Error');
        expect(e.message).toBe(
          'The first "@context" value must be "https://www.w3.org/2018/credentials/v1".'
        );
      }
    }
  );

  it(
    'should fail when "credentialStatus" does not ' +
      'exist in "statusTypeMatches"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      // remove required credentialStatus property
      delete credential.credentialStatus;
      const result = statusTypeMatches({ credential });

      expect(result).toBe(false);
    }
  );

  it(
    'should fail when "credentialStatus" is not an object in ' +
      '"statusTypeMatches"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      try {
        // change credentialStatus to a string type
        credential.credentialStatus = 'https://example.com/status/1#50000';
        statusTypeMatches({ credential });
      } catch (e) {
        expect(e.name).toBe('Error');
        expect(e.message).toBe('"credentialStatus" is invalid.');
      }
    }
  );

  it(
    'should return false when "CONTEXTS.RL_V1" is not in ' +
      '"@contexts" in "statusTypeMatches"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      delete credential['@context'][1];
      credential.credentialStatus = {
        id: 'https://example.com/status/1#50000',
        type: 'RevocationList2020Status',
        revocationListIndex: '50000',
        revocationListCredential: revocationListCredential.id,
      };
      const result = statusTypeMatches({ credential });
      expect(result).toBe(false);
    }
  );

  it(
    'should fail when "CONTEXTS.RL_V1" is not in "@contexts" ' +
      'in "assertRevocationList2020"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential = await createCredential({ id, list });
      try {
        delete credential['@context'][1];
        assertRevocationList2020Context({ credential });
      } catch (e) {
        expect(e.name).toBe('TypeError');
        expect(e.message).toBe(
          '"@context" must include "https://w3id.org/vc-revocation-list-2020/v1".'
        );
      }
    }
  );

  it(
    'should fail when credentialStatus is not an object for ' +
      '"getCredentialStatus"',
    async () => {
      const id = 'https://example.com/status/1';
      const list = await createList({ length: 100000 });
      const credential: any = await createCredential({ id, list });

      try {
        delete credential.credentialStatus;
        getCredentialStatus({ credential });
      } catch (e) {
        expect(e.name).toBe('Error');
        expect(e.message).toBe('"credentialStatus" is missing or invalid.');
      }
    }
  );

  it('should fail to verify when documentLoader is not a function', async () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
      id: 'urn:uuid:a0418a78-7924-11ea-8a23-10bf48838a41',
      type: ['VerifiableCredential', 'example:TestCredential'],
      credentialSubject: {
        id: 'urn:uuid:4886029a-7925-11ea-9274-10bf48838a41',
        'example:test': 'foo',
      },
      credentialStatus: {
        id: 'https://example.com/status/1#67342',
        type: 'RevocationList2020Status',
        revocationListCredential: revocationListCredential.id,
      },
    };
    const documentLoader = 'https://example.com/status/1';

    const result = await checkStatus({
      credential,
      documentLoader: documentLoader as any,
      suite: new Ed25519Signature2018(),
      verifyRevocationListCredential: false,
    });
    expect(result.verified).toBe(false);
    if (result.error) {
      expect(result.error.name).toBe('TypeError');
      expect(result.error.message).toBe('"documentLoader" must be a function.');
    }
  });

  it(
    'should fail to verify when suite is not an object or array of ' +
      'objects in checkStatus',
    async () => {
      const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
        id: 'urn:uuid:e74fb1d6-7926-11ea-8e11-10bf48838a41',
        type: ['VerifiableCredential', 'example:TestCredential'],
        credentialSubject: {
          id: 'urn:uuid:011e064e-7927-11ea-8975-10bf48838a41',
          'example:test': 'bar',
        },
        credentialStatus: {
          id: 'https://example.com/status/1#50000',
          type: 'RevocationList2020Status',
          revocationListIndex: '50000',
          revocationListCredential: revocationListCredential.id,
        },
      };

      const suite = '{}';

      const result = await checkStatus({
        credential,
        documentLoader,
        suite: suite as any,
        verifyRevocationListCredential: true,
      });
      expect(result.verified).toBe(false);
      if (result.error) {
        expect(result.error.name).toBe('TypeError');
        expect(result.error.message).toBe(
          '"suite" must be an object or an array of objects.'
        );
      }
    }
  );

  it(
    'should fail to verify when "RevocationList2020Credential" ' +
      'is not valid',
    async () => {
      const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1', CONTEXTS.RL_V1],
        id: 'urn:uuid:e74fb1d6-7926-11ea-8e11-10bf48838a41',
        issuer: 'exampleissuer',
        issuanceDate: '2020-03-10T04:24:12.164Z',
        type: ['VerifiableCredential', 'RevocationList2020Credential'],
        credentialSubject: {
          id: 'urn:uuid:011e064e-7927-11ea-8975-10bf48838a41',
          'example:test': 'bar',
        },
        credentialStatus: {
          id: 'https://example.com/status/1#50000',
          type: 'RevocationList2020Status',
          revocationListIndex: 50000,
          revocationListCredential: revocationListCredential.id,
        },
      };

      delete credential.type[1];
      const result = await checkStatus({
        credential,
        documentLoader,
        suite: {} as any,
        verifyRevocationListCredential: true,
      });
      expect(result.verified).toBe(false);
      if (result.error) {
        expect(result.error.name).toBe('Error');
        expect(result.error.message).toBe(
          '"RevocationList2020Credential" not verified; reason: Verification error(s).'
        );
      }
    }
  );
});
