import { keys } from '../__fixtures__';
import {
  getCryptoKeyPairFromJsonWebKey2020,
  getSigner,
  getVerifier,
} from './raw';

for (let c in keys) {
  let k = keys[c];
  describe(`${k.type} ${k.publicKeyJwk.kty} ${k.publicKeyJwk.crv ||
    k.publicKeyJwk.alg}`, () => {
    it('sign and verify from CryptoKey', async () => {
      const {
        publicKey,
        privateKey,
      } = await getCryptoKeyPairFromJsonWebKey2020(k);
      const signer = await getSigner(privateKey as CryptoKey);
      const verifier = await getVerifier(publicKey as CryptoKey);
      const message = Buffer.from('hello');
      const signature = await signer.sign({ data: message });
      const verified = await verifier.verify({ data: message, signature });
      expect(verified).toBe(true);
    });

    it('sign and verify from JsonWebKey2020', async () => {
      const signer = await getSigner(k);
      const vm = JSON.parse(JSON.stringify(k));
      delete vm.privateKeyJwk;
      const verifier = await getVerifier(vm);
      const message = Buffer.from('hello');
      const signature = await signer.sign({ data: message });
      const verified = await verifier.verify({ data: message, signature });
      expect(verified).toBe(true);
    });

    it('should throw if verification', async () => {
      try {
        await getVerifier(k);
      } catch (e) {
        expect(e.message).toBe('verification method contained private key!');
      }
    });

    it('should throw if tampered', async () => {
      const signer = await getSigner(k);
      const verifier = await getVerifier(k, { ignorePrivateKey: true });
      const message = Buffer.from('hello');
      const signature = await signer.sign({ data: message });
      const verified = await verifier.verify({
        data: Buffer.from('bye'),
        signature,
      });
      expect(verified).toBe(false);
    });
  });
}
