export interface KeyPairOptions {
  id: string;
  type: string;
  controller: string;
  publicKey: CryptoKey;
  privateKey?: CryptoKey;
}
