import { keys } from '../__fixtures__';
import { getCryptoKeyPairFromJsonWebKey2020 } from './raw';
import { getJwaAlgFromJwk, getSigner, getVerifier } from './jws';
import base64url from 'base64url';
import * as jose from 'jose';
import {
  DetachedJwsSigner,
  DetachedJwsVerifier,
  JwsSigner,
  JwsVerifier,
} from '../types';

for (let c in keys) {
  let k = keys[c];
  const alg = getJwaAlgFromJwk(k.publicKeyJwk);
  describe(`${k.type} ${k.publicKeyJwk.kty} ${alg}`, () => {
    it('sign and verify', async () => {
      const {
        publicKey,
        privateKey,
      } = await getCryptoKeyPairFromJsonWebKey2020(k);
      const signer = await getSigner(privateKey as CryptoKey);
      const verifier = await getVerifier(publicKey as CryptoKey);
      const message = 'hello';
      const signature = await (signer as JwsSigner).sign({ data: message });
      const verifiedWithJose = await jose.JWS.verify(
        signature,
        await jose.JWK.asKey(k.publicKeyJwk)
      );
      expect(verifiedWithJose.toString()).toBe(message);
      const verifiedByUs = await (verifier as JwsVerifier).verify({
        signature,
      });
      expect(verifiedByUs).toBe(true);
      const signature2 = await jose.JWS.sign(
        message,
        await jose.JWK.asKey(k.privateKeyJwk)
      );
      const verifiedByUs2 = await (verifier as JwsVerifier).verify({
        signature: signature2,
      });
      expect(verifiedByUs2).toBe(true);
    });

    it('detached sign and verify', async () => {
      const {
        publicKey,
        privateKey,
      } = await getCryptoKeyPairFromJsonWebKey2020(k);
      const signer = await getSigner(privateKey as CryptoKey, true);
      const verifier = await getVerifier(publicKey as CryptoKey, true);
      const message = 'hello';
      const signature = await (signer as DetachedJwsSigner).sign({
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
      const verifiedByUs = await (verifier as DetachedJwsVerifier).verify({
        data: Buffer.from(message),
        signature,
      });
      expect(verifiedByUs).toBe(true);
      const signature2 = await jose.JWS.sign(
        message,
        await jose.JWK.asKey(k.privateKeyJwk),
        { ...JSON.parse(base64url.toBuffer(parts[0]).toString()) }
      );
      const detachedSignature2 = [
        signature2.split('.')[0],
        signature2.split('.')[2],
      ].join('..');
      const verifiedByUs2 = await (verifier as DetachedJwsVerifier).verify({
        data: Buffer.from(message),
        signature: detachedSignature2,
      });
      expect(verifiedByUs2).toBe(true);
    });
  });
}
