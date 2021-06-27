import { Bls12381G1KeyPair } from './Bls12381G1KeyPair';

it('generate', async () => {
  const kn = await Bls12381G1KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
          'hex'
        )
      );
    },
  });
  expect(kn.id).toBe(
    'did:key:z3tEG7RQ27jrpS8XX8jBBL5o2FZaUUCx7UaHAJmhSsUPW8jNtqcS3QByh6fBmn3kXXhEn7#z3tEG7RQ27jrpS8XX8jBBL5o2FZaUUCx7UaHAJmhSsUPW8jNtqcS3QByh6fBmn3kXXhEn7'
  );
});

it('JWK: from / export', async () => {
  const kn = await Bls12381G1KeyPair.from({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G1',
      x: 'j1iyRQphXQsYgZI7IPsiD2vV0B0lUHBgno6eVT8_OTgHW8QwguPznplJ3H5HEXk_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G1',
      x: 'j1iyRQphXQsYgZI7IPsiD2vV0B0lUHBgno6eVT8_OTgHW8QwguPznplJ3H5HEXk_',
      d: 'WcpVbiWRlgPvZ6Bi1NtLs-b57lRt-xLg1y0SwURS_l0',
    },
  });
  const kx = await kn.export({ type: 'JsonWebKey2020', privateKey: true });
  expect(kx).toEqual({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G1',
      x: 'j1iyRQphXQsYgZI7IPsiD2vV0B0lUHBgno6eVT8_OTgHW8QwguPznplJ3H5HEXk_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'BLS12381_G1',
      x: 'j1iyRQphXQsYgZI7IPsiD2vV0B0lUHBgno6eVT8_OTgHW8QwguPznplJ3H5HEXk_',
      d: 'WcpVbiWRlgPvZ6Bi1NtLs-b57lRt-xLg1y0SwURS_l0',
    },
  });
});

it('Base58: from / export', async () => {
  const kn = await Bls12381G1KeyPair.from({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'Bls12381G1Key2020',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    publicKeyBase58:
      '6FywSzB5BPd7xehCo1G4nYHAoZPMMP3gd4PLnvgA6SsTsogtz8K7RDznqLpFPLZXAE',
    privateKeyBase58: '73WELviurBkBCy23h31sjdZ78Y1o5cgWhbGfYr9ePH3i',
  });
  const kx = await kn.export({ type: 'Bls12381G1Key2020', privateKey: true });
  expect(kx).toEqual({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'Bls12381G1Key2020',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    publicKeyBase58:
      '6FywSzB5BPd7xehCo1G4nYHAoZPMMP3gd4PLnvgA6SsTsogtz8K7RDznqLpFPLZXAE',
    privateKeyBase58: '73WELviurBkBCy23h31sjdZ78Y1o5cgWhbGfYr9ePH3i',
  });
});

it('fingerprintFromPublicKey', async () => {
  const f = await Bls12381G1KeyPair.fingerprintFromPublicKey({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'Bls12381G1Key2020',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    publicKeyBase58:
      '6FywSzB5BPd7xehCo1G4nYHAoZPMMP3gd4PLnvgA6SsTsogtz8K7RDznqLpFPLZXAE',
  });

  expect(f).toBe(
    'z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA'
  );
});

it('signer / verifier', async () => {
  expect.assertions(2);
  const kn = await Bls12381G1KeyPair.from({
    id:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA#z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    type: 'Bls12381G1Key2020',
    controller:
      'did:key:z3tEFALUKUzzCAvytMHX8X4SnsNsq6T5tC5Zb18oQEt1FqNcJXqJ3AA9umgzA9yoqPBeWA',
    publicKeyBase58:
      '6FywSzB5BPd7xehCo1G4nYHAoZPMMP3gd4PLnvgA6SsTsogtz8K7RDznqLpFPLZXAE',
    privateKeyBase58: '73WELviurBkBCy23h31sjdZ78Y1o5cgWhbGfYr9ePH3i',
  });
  try {
    kn.signer();
  } catch (e) {
    expect(e.message).toBe('Not implemented for Bbs');
  }
  try {
    kn.verifier();
  } catch (e) {
    expect(e.message).toBe('Not implemented for Bbs');
  }
});
