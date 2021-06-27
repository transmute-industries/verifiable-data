import { WebCryptoKey } from '../WebCryptoKey';
// https://ns.did.ai/suites/multikey-2021/
describe('can export as multikey', () => {
  it('P-521', async () => {
    const fingerprint =
      'z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'P521Key2021' });
    expect(k1).toEqual({
      id:
        'did:key:z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f#z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f',
      type: 'P521Key2021',
      controller:
        'did:key:z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f',
      publicKeyBase58:
        '6AYA5PnWHzdwRCM22E2yDvRctNQ6SmgttyLCDAFeTNnzPbaUXW5c7uk139fn2HTA4bYMJrpEmBnJq2dLCiCoB7XJRi3',
    });
  });

  it('P-384', async () => {
    const fingerprint =
      'z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'P384Key2021' });
    expect(k1).toEqual({
      id:
        'did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9#z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
      type: 'P384Key2021',
      controller:
        'did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
      publicKeyBase58:
        'ad1jjx1hRrEkMWSsFsXpLULAbmUq67ii1jRsBNtYEKhCwLXTo4wcjY7C2K4cuGZ859',
    });
  });

  it('P-256', async () => {
    const fingerprint = 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
    const k = await WebCryptoKey.fromFingerprint({ fingerprint });
    const k1 = await k.export({ type: 'P256Key2021' });
    expect(k1).toEqual({
      id:
        'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv#zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
      type: 'P256Key2021',
      controller: 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv',
      publicKeyBase58: '23youFZZdHMVdpv28DRSWP2zJbTJ8KHBeSKUX3qVqqnmp',
    });
  });
});
