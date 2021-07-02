import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { JWS } from "@transmute/jose-ld";

export class Ed25519VerificationKey2018 extends Ed25519KeyPair {
  static generate = async ({
    secureRandom
  }: {
    secureRandom: () => Uint8Array;
  }) => {
    const k = await Ed25519KeyPair.generate({ secureRandom });
    return new Ed25519VerificationKey2018(k);
  };

  static from = async (args: any) => {
    const k = await Ed25519KeyPair.from(args);
    return new Ed25519VerificationKey2018(k);
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
      this.signer = () => {
        return {
          sign: async ({ data }: any) => {
            return signer.sign({ data });
          }
        } as any;
      };
    }
  }
}
