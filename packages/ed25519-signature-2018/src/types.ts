export type VerificationMethod = {
  id: string;
  type: string;
  controller: string | ControllerObject;
  publicKeyBase58?: string;
  publicKeyJwk?: PublicKeyJwk;
  publicKeyMultibase?: string;
};

export type ControllerObject = {
  id: string;
};

export type PublicKeyJwk = {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: {
    kty: string;
    crv: string;
    x: string;
  };
};
