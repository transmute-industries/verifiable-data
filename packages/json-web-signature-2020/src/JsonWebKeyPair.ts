import { KeyPair, jws, JsonWebKey2020 } from '@transmute/web-crypto-key-pair';

export { KeyPair } from '@transmute/web-crypto-key-pair';

export class JsonWebKeyPair extends KeyPair {
  static from = async (k: JsonWebKey2020) => {
    const { publicKey, privateKey } = await KeyPair.from(k);
    return new JsonWebKeyPair({
      id: k.id,
      type: 'JsonWebKey2020',
      controller: k.controller,
      publicKey,
      privateKey,
    });
  };
  signer() {
    if (this.privateKey) {
      return jws.getDetachedJwsSigner(this.privateKey) as any;
    }
    throw new Error(`No private key to sign with.`);
  }
  verifier() {
    if (this.publicKey) {
      return jws.getDetachedJwsVerifier(this.publicKey) as any;
    }
    throw new Error(`No public key to verify with.`);
  }
}
