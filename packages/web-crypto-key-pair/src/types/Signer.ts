export type SignerOptions = { data: Uint8Array };

export type Signer = {
  sign: (options: SignerOptions) => Promise<Uint8Array>;
};

export type JwsSignerOptions = { data: string };

export type JwsSigner = {
  sign: (options: JwsSignerOptions) => Promise<string>;
};

export type DetachedJwsSignerOptions = { data: Uint8Array };

export type DetachedJwsSigner = {
  sign: (options: DetachedJwsSignerOptions) => Promise<string>;
};
