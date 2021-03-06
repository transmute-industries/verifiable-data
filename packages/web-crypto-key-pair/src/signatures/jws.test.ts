import { keys } from '../__fixtures__';
import { getCryptoKeyPairFromJsonWebKey2020 } from '../key';
import {
  getJwaAlgFromJwk,
  getJwsSigner,
  getJwsVerifier,
  getDetachedJwsSigner,
  getDetachedJwsVerifier,
} from './jws';
import { base64url } from '../encoding';
import * as jose from 'jose';

for (let c in keys) {
  let k = keys[c];
  const alg = getJwaAlgFromJwk(k.publicKeyJwk);
  describe(`${k.type} ${k.publicKeyJwk.kty} ${alg}`, () => {
    it('sign and verify', async () => {
      const {
        publicKey,
        privateKey,
      } = await getCryptoKeyPairFromJsonWebKey2020(k);
      const signer = await getJwsSigner(privateKey as CryptoKey);
      const verifier = await getJwsVerifier(publicKey as CryptoKey);
      const message = 'hello';
      const signature = await signer.sign({ data: message });
      const verifiedWithJose = await jose.JWS.verify(
        signature,
        await jose.JWK.asKey(k.publicKeyJwk)
      );
      expect(verifiedWithJose.toString()).toBe(message);
      const verifiedByUs = await verifier.verify({
        signature,
      });
      expect(verifiedByUs).toBe(true);
      const signature2 = await jose.JWS.sign(
        message,
        await jose.JWK.asKey(k.privateKeyJwk)
      );
      const verifiedByUs2 = await verifier.verify({
        signature: signature2,
      });
      expect(verifiedByUs2).toBe(true);
    });

    it('detached sign and verify', async () => {
      const {
        publicKey,
        privateKey,
      } = await getCryptoKeyPairFromJsonWebKey2020(k);
      const signer = await getDetachedJwsSigner(privateKey as CryptoKey);
      const verifier = await getDetachedJwsVerifier(publicKey as CryptoKey);
      const message = 'hello';
      const signature = await signer.sign({
        data: Buffer.from(message),
      });

      const parts: any = signature.split('..');

      const verifiedWithJose = await jose.JWS.verify(
        Buffer.concat([
          Buffer.from(parts[0]),
          Buffer.from('.'),
          Buffer.from(message),
          Buffer.from('.'),
          Buffer.from(parts[1]),
        ]).toString(),
        await jose.JWK.asKey(k.publicKeyJwk),
        { crit: ['b64'] }
      );
      expect(verifiedWithJose.toString()).toBe(message);
      const verifiedByUs = await verifier.verify({
        data: Buffer.from(message),
        signature,
      });
      expect(verifiedByUs).toBe(true);
      const signature2 = await jose.JWS.sign(
        message,
        await jose.JWK.asKey(k.privateKeyJwk),
        { ...JSON.parse(base64url.decode(parts[0])) }
      );
      const detachedSignature2 = [
        signature2.split('.')[0],
        signature2.split('.')[2],
      ].join('..');
      const verifiedByUs2 = await verifier.verify({
        data: Buffer.from(message),
        signature: detachedSignature2,
      });
      expect(verifiedByUs2).toBe(true);
    });
  });
}
