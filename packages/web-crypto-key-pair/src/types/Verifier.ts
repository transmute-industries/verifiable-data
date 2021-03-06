export type VerifierOptions = { data: Uint8Array; signature: Uint8Array };

export type Verifier = {
  verify: (options: VerifierOptions) => Promise<boolean>;
};

export type JwsVerifierOptions = { signature: string };

export type JwsVerifier = {
  verify: (options: JwsVerifierOptions) => Promise<boolean>;
};

export type DetachedJwsVerifierOptions = {
  data: Uint8Array;
  signature: string;
};

export type DetachedJwsVerifier = {
  verify: (options: DetachedJwsVerifierOptions) => Promise<boolean>;
};
