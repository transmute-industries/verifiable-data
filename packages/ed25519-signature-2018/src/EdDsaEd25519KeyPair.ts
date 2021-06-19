import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { JWS } from "@transmute/jose-ld";

export class EdDsaEd25519KeyPair extends Ed25519KeyPair {
  static generate = async ({
    secureRandom
  }: {
    secureRandom: () => Uint8Array;
  }) => {
    const k = await Ed25519KeyPair.generate({ secureRandom });
    return new EdDsaEd25519KeyPair(k);
  };

  static from = async (args: any) => {
    const k = await Ed25519KeyPair.from(args);
    return new EdDsaEd25519KeyPair(k);
  };
  constructor(args: any) {
    super(args);
    const JWA_ALG = "EdDSA";
    const verifier = JWS.createVerifier(this.verifier("EdDsa"), JWA_ALG, {
      detached: true
    });
    this.verifier = () => verifier as any;

    if (this.privateKey) {
      const signer = JWS.createSigner(this.signer("EdDsa"), JWA_ALG, {
        detached: true
      });
      this.signer = () => signer as any;
    }
  }
}
