import { CredentialHandlerRequest, CredentialHandlerResponse } from "./chapi";

import {
  IssueCredential,
  VerifyCredential,
  VerifyPresentation,
  PresentCredentials,
  DeriveCredential,
} from "./vc";

export interface VcPlugin {
  // issuer
  issue: (config: IssueCredential) => Promise<any>;

  // verifier
  verifyCredential: (config: VerifyCredential) => Promise<any>;
  verifyPresentation: (config: VerifyPresentation) => Promise<any>;

  // holder
  createVerifiablePresentation: (config: PresentCredentials) => Promise<any>;
  deriveCredential: (config: DeriveCredential) => Promise<any>;
  // chapi
  authorizeCredentialFlow: (
    flowType: string,
    requiredCredentialTypes: string[]
  ) => Promise<VcPlugin>;
  authorizePresentationFlow: (
    controller: string,
    authorizedFlows: string[]
  ) => Promise<VcPlugin>;
  createNotificationQueryRequest: (
    flowType: string,
    flowRecipients?: string[]
  ) => CredentialHandlerRequest;
  createNotificationQueryResponse: (
    domain: string,
    flow: CredentialHandlerRequest
  ) => CredentialHandlerResponse;
}
