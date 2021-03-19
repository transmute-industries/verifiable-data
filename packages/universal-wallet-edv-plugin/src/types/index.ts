export interface VaultClient {
  vault_endpoint: string;
  keys: any;
  invocationSigner: any;
  keyResolver: any;
  vault: any;
}

export interface VaultClientConfig {
  vault_endpoint: string;
  ed25519Key: any;
  x25519Key: any;
  hmacSecret: Buffer;
}
