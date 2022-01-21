import crypto from '../../crypto';
import { instantiateSecp256k1 } from '@bitauth/libauth';

import { getPublicKeyFromPublicKeyJwk } from '../../getPublicKeyFromPublicKeyJwk';
const publicKeyJwk = require('./__fixtures__/ms.publicKeyJwk.json');

describe('raw ES256K verify from scratch', () => {
  it('can verify complex object', async () => {
    const { jws } = require('./__fixtures__/ms.complex-object-signed.json');
    const [_1, _2, _3] = jws.split('.');
    const message = Buffer.from([_1, _2].join('.'));
    expect(_3).toBeDefined();
    const pubkey = getPublicKeyFromPublicKeyJwk(publicKeyJwk);
    const sig = Buffer.from(_3, 'base64');
    const msgHash = crypto
      .createHash('sha256')
      .update(message)
      .digest();
    const secp256k1 = await instantiateSecp256k1();
    const verified = await secp256k1.verifySignatureCompact(
      sig,
      pubkey,
      msgHash
    );
    expect(verified).toBe(true);
  });
});
