export interface IssueCredential {
  credential: any;
  options: any;
}

export interface VerifyCredential {
  credential: any;
  options: any;
}

export interface PresentCredentials {
  verifiableCredential?: any;
  presentation?: any;
  options: any;
}

export interface VerifyPresentation {
  presentation: any;
  options: any;
}

export interface DeriveCredential {
  verifiableCredential: any;
  frame: any;
  options: any;
}
