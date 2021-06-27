import { WebCryptoKey } from '../WebCryptoKey';
describe('can get public key from compressed fingerprint', () => {
  it('P-521', async () => {
    const fingerprint =
      'z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'JsonWebKey2020' });
    expect(k1).toEqual({
      id:
        'did:key:z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f#z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f',
      type: 'JsonWebKey2020',
      controller:
        'did:key:z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'P-521',
        x:
          'AQgyFy6EwH3_u_KXPw8aTXTY7WSVytmbuJeFpq4U6LipxtSmBJe_jjRzms9qubnwm_fGoHMQlvQ1vzS2YLusR2V0',
        y:
          'Ab06MCcgoG7dM2I-VppdLV1k3lDoeHMvyYqHVfP05Ep2O7Zu0Qwd6IVzfZi9K0KMDud22wdnGUpUtFukZo0EeO15',
      },
    });
  });

  it('P-384', async () => {
    const fingerprint =
      'z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'JsonWebKey2020' });
    expect(k1).toEqual({
      id:
        'did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9#z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
      type: 'JsonWebKey2020',
      controller:
        'did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'P-384',
        x: 'lInTxl8fjLKp_UCrxI0WDklahi-7-_6JbtiHjiRvMvhedhKVdHBfi2HCY8t_QJyc',
        y: 'y6N1IC-2mXxHreETBW7K3mBcw0qGr3CWHCs-yl09yCQRLcyfGv7XhqAngHOu51Zv',
      },
    });
  });

  it('P-256', async () => {
    const fingerprint = 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'JsonWebKey2020' });
    expect(k1).toEqual({
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
});
