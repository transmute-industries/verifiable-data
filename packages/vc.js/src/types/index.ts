export interface IIssueOptions {
  credential: any;
  suite: any;
  purpose?: any;
  documentLoader: any;
}

export interface IVerifyOptions {
  presentation?: any;
  credential?: any;
  checkStatus?: any;
  suite?: any;
  suiteMap?: any;
  purpose?: any;
  unsignedPresentation?: any;
  documentLoader: any;
  controller?: any;
  domain?: any;
  challenge?: any;
  presentationPurpose?: any;
}

export interface IPurposeValidateOptions {
  document?: any;
  suite?: any;
  verificationMethod?: any;
  documentLoader?: any;
  expansionMap?: any;
}

export interface IVcJwtPayload {
  iss: string;
  sub: string;
  nbf?: number;
  exp?: number;
  jti?: string;
  vc: object;
}

export interface IVcJwtPressentationPayload {
  iss: string;
  sub: string;
  jti?: string;
  vp: object;
}

export interface IVpOptions {
  domain: string;
  challenge: string;
}
