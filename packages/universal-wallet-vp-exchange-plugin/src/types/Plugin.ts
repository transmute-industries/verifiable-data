import { CredentialHandlerRequest } from "./CredentialHandlerRequest";
import { CredentialHandlerResponse } from "./CredentialHandlerResponse";

export interface VpxPlugin {
  // chapi
  authorizeCredentialFlow: (
    flowType: string,
    requiredCredentialTypes: string[]
  ) => Promise<VpxPlugin>;
  authorizePresentationFlow: (
    controller: string,
    authorizedFlows: string[]
  ) => Promise<VpxPlugin>;
  createNotificationQueryRequest: (
    flowType: string,
    flowRecipients?: string[]
  ) => CredentialHandlerRequest;
  createNotificationQueryResponse: (
    domain: string,
    flow: CredentialHandlerRequest
  ) => CredentialHandlerResponse;
  verifyAndAddPresentation: (
    presentation: any,
    options: any
  ) => Promise<VpxPlugin>;
}
