import {
  IssueCredential,
  VerifyCredential,
  VerifyPresentation,
  PresentCredentials,
  DeriveCredential
} from "./Interfaces";

export interface VcPlugin {
  // issuer
  issue: (config: IssueCredential) => Promise<any>;

  // verifier
  verifyCredential: (config: VerifyCredential) => Promise<any>;
  verifyPresentation: (config: VerifyPresentation) => Promise<any>;

  // holder
  createVerifiablePresentation: (config: PresentCredentials) => Promise<any>;
  deriveCredential: (config: DeriveCredential) => Promise<any>;
}
