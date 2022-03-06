import * as api from './statusList';

const rlvc = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/suites/jws-2020/v1',
    'https://w3id.org/vc-revocation-list-2020/v1',
  ],
  id: 'https://api.did.actor/revocation-lists/1.json',
  issuanceDate: '2010-01-01T19:23:24Z',
  type: ['VerifiableCredential', 'RevocationList2020Credential'],
  credentialSubject: {
    id: 'https://api.did.actor/revocation-lists/1.json#list',
    type: 'RevocationList2020',
    encodedList:
      'H4sIAAAAAAAAA-3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC-BthKQuJI6AEA',
  },
};
const key = {
  id:
    'did:key:z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce#z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce',
  type: 'JsonWebKey2020',
  controller: 'did:key:z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'ic6OKCg2acdx3rvsWub9VCpSU93M1lVAT8lvAl05zJM',
  },
  privateKeyJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'ic6OKCg2acdx3rvsWub9VCpSU93M1lVAT8lvAl05zJM',
    d: '72zj79imvVPhvw4VXFENUpUPDWzQypIjYDauokybmao',
  },
};

it('can revoke a credential index', async () => {
  const credentialIndex = 100;
  const status = true;
  const updated = await api.setStatusListIndex(
    key,
    rlvc,
    credentialIndex,
    status
  );
  expect(updated.proof).toBeDefined();
  expect(updated.credentialSubject.encodedList).not.toBe(
    rlvc.credentialSubject.encodedList
  );
});

it('can check a revocation list index', async () => {
  const credentialIndex = 100;
  const bit = await api.isStatusListIndexSet(rlvc, credentialIndex);
  expect(bit).toBe(false);
  const updated = await api.setStatusListIndex(
    key,
    rlvc,
    credentialIndex,
    true
  );
  const bit2 = await api.isStatusListIndexSet(updated, credentialIndex);
  expect(bit2).toBe(true);
});
