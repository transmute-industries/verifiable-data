import { WebCryptoKey, JsonWebKey2020 } from '../index';

describe('fromFingerprint', () => {
  it('p256 zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv', async () => {
    const kn = await WebCryptoKey.fromFingerprint({
      fingerprint: 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
    });
    const kx = await kn.export({ type: 'JsonWebKey2020' });
    expect(kx).toEqual({
      id:
        'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv#zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
      type: 'JsonWebKey2020',
      controller: 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'igrFmi0whuihKnj9R3Om1SoMph72wUGeFaBbzG2vzns',
        y: 'efsX5b10x8yjyrj4ny3pGfLcY7Xby1KzgqOdqnsrJIM',
      },
    });
  });

  it('p256 zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169', async () => {
    const kn = await WebCryptoKey.fromFingerprint({
      fingerprint: 'zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169',
    });
    const kx = await kn.export({ type: 'JsonWebKey2020' });
    expect(kx).toEqual({
      id:
        'did:key:zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169#zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169',
      type: 'JsonWebKey2020',
      controller: 'did:key:zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'fyNYMN0976ci7xqiSdag3buk-ZCwgXU4kz9XNkBlNUI',
        y: 'hW2ojTNfH7Jbi8--CJUo3OCbH3y5n91g-IMA9MLMbTU',
      },
    });
  });
});

describe('generate / export / from', () => {
  const params = [
    {
      kty: 'EC',
      crvOrSize: 'P-256',
      prefix: 'zDna',
    },
    {
      kty: 'EC',
      crvOrSize: 'P-384',
      prefix: 'z82L',
    },
    {
      kty: 'EC',
      crvOrSize: 'P-521',
      prefix: 'z2J9',
    },
  ];

  params.forEach(p => {
    it(p.crvOrSize, async () => {
      const { kty, crvOrSize, prefix } = p;
      const kn = await WebCryptoKey.generate({ kty, crvOrSize });
      expect(kn.type).toBe('JsonWebKey2020');
      const exported = await kn.export({
        type: 'JsonWebKey2020',
        privateKey: true,
      });
      expect(kn.id.substr(8, 4)).toBe(prefix);
      expect(exported.id).toBe(kn.id);
      expect(exported.controller).toBe(kn.controller);
      const k2 = await WebCryptoKey.from(exported as JsonWebKey2020);
      const k3 = await k2.export({
        type: 'JsonWebKey2020',
        privateKey: true,
      });
      expect(k3).toEqual(exported);
    });
  });
});

it('fingerprintFromPublicKey', async () => {
  const kn = await WebCryptoKey.fromFingerprint({
    fingerprint: 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
  });
  const exported = await kn.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });
  const f = await WebCryptoKey.fingerprintFromPublicKey(
    exported as JsonWebKey2020
  );
  expect(f).toBe('zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv');
});

it('fingerprint', async () => {
  const kn = await WebCryptoKey.fromFingerprint({
    fingerprint: 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
  });
  const f = await kn.fingerprint();
  expect(f).toBe('zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv');
});

it('deriveSecret', async () => {
  const kn = await WebCryptoKey.generate();
  const s = await kn.deriveSecret({
    publicKey: await kn.export({
      type: 'JsonWebKey2020',
      privateKey: false,
    }),
  });
  expect(s.length).toBe(32);
});
