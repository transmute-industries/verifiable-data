import { ld as vc } from '@transmute/vc.js';

import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';

import { Bls12381G2KeyPair } from '@transmute/did-key-bls12381';
import { BbsBlsSignature2020 } from '@mattrglobal/jsonld-signatures-bbs';
import { createList, createCredential, checkStatus } from '..';

import { documentLoader, signedRevocationList2020 } from '../__fixtures__';

let suite: Ed25519Signature2018;

beforeAll(async () => {
  suite = new Ed25519Signature2018({
    key: await Ed25519VerificationKey2018.from({
      id:
        'did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4#z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4',
      type: 'JsonWebKey2020',
      controller: 'did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4',
      publicKeyJwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: 'TQY0tCyM0wMZhJbDQ9B-IoZXWN9hS8bCHkpwVXlVves',
      },
      privateKeyJwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        d: 'XbVr_jPdbQXCoH9hvO1YbSkH7f-FfVl90hH8MKYW44I',
        x: 'TQY0tCyM0wMZhJbDQ9B-IoZXWN9hS8bCHkpwVXlVves',
      },
    }),
    // adding date here makes this fixture stable
    date: '2021-03-01T01:16:12.860Z',
  });
});

it('issuer can create signed revocation list', async () => {
  const id = 'https://example.com/status/2';
  const list = await createList({ length: 100000 });
  const verifiableCredentialStatusList = await vc.issue({
    credential: {
      ...(await createCredential({ id, list })),
      issuer: suite.key.controller,
      issuanceDate: '2021-03-01T01:16:12.860Z',
    },
    suite,
    documentLoader,
  });
  expect(verifiableCredentialStatusList).toEqual(signedRevocationList2020);
});

it('issuer can create credential with revocation status', async () => {
  const suite2 = new BbsBlsSignature2020({
    key: (await Bls12381G2KeyPair.from({
      id:
        'did:key:zUC7ETgFk2GQtXRrf3yDTfDGvHKGeHhRUCuUfY4Cs7pksuQm392ZNyx6NqZZCd34UUUztvDKjcTxk1gpyu28k4srHP3V9X182vdw2eEmy73V4miZdjvYrPYGxMwQBWpFJrbi6DC#zUC7ETgFk2GQtXRrf3yDTfDGvHKGeHhRUCuUfY4Cs7pksuQm392ZNyx6NqZZCd34UUUztvDKjcTxk1gpyu28k4srHP3V9X182vdw2eEmy73V4miZdjvYrPYGxMwQBWpFJrbi6DC',
      controller:
        'did:key:zUC7ETgFk2GQtXRrf3yDTfDGvHKGeHhRUCuUfY4Cs7pksuQm392ZNyx6NqZZCd34UUUztvDKjcTxk1gpyu28k4srHP3V9X182vdw2eEmy73V4miZdjvYrPYGxMwQBWpFJrbi6DC',
      type: 'JsonWebKey2020',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'BLS12381_G2',
        x:
          'p0cHxN3szDcMnBxU8n2ylLhMCvvSCg4KEhWpnCd4UWkOaam9tm935WoTpjwlDNllEiDu1sxi7mo-22IbqG1cGKJU3ucaT3iEKN5k9K0FCCWX0CCyJFpOdJBy691wxPLf',
      },
      privateKeyJwk: {
        kty: 'EC',
        crv: 'BLS12381_G2',
        x:
          'p0cHxN3szDcMnBxU8n2ylLhMCvvSCg4KEhWpnCd4UWkOaam9tm935WoTpjwlDNllEiDu1sxi7mo-22IbqG1cGKJU3ucaT3iEKN5k9K0FCCWX0CCyJFpOdJBy691wxPLf',
        d: 'E5Fa9XQhDQEgIwhuM6oNRVuqjaJtecTzrB7AP2IODsg',
      },
    })) as any,
    // adding date here makes this fixture stable
    date: '2021-03-01T01:16:12.860Z',
  });
  const verifiableCredentialWithRevocationStatus = await vc.issue({
    credential: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
        'https://w3id.org/vc-revocation-list-2020/v1',
      ],
      id: 'https://example.com/credenials/123',
      type: ['VerifiableCredential'],
      issuer: (suite2 as any).key.controller,
      issuanceDate: '2021-03-01T01:16:12.860Z',
      credentialStatus: {
        id: 'https://example.com/status/2#0',
        type: 'RevocationList2020Status',
        revocationListIndex: '0',
        revocationListCredential: 'https://example.com/status/2',
      },
      credentialSubject: {
        id: 'did:example:123',
      },
    },
    suite: suite2,
    documentLoader,
  });

  const wrapInVp = (credential: any) => {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [credential],
    };
  };

  const suiteMap = {
    Ed25519Signature2018: Ed25519Signature2018,
    BbsBlsSignature2020: BbsBlsSignature2020,
  };
  const result = await vc.verify({
    unsignedPresentation: wrapInVp(verifiableCredentialWithRevocationStatus),
    documentLoader,
    suiteMap,
    checkStatus: (args: any) => {
      return checkStatus({ ...args, suiteMap });
    }, // required
  });
  // console.log(JSON.stringify(result, null, 2));
  expect(result.verified).toBe(true);
});
