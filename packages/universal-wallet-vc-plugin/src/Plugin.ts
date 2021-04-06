import * as Factory from "factory.ts";

import { CredentialHandlerRequest, VcPlugin, VcWalletFactory } from "./types";

import { issue } from "./issue";
import { verifyCredential } from "./verifyCredential";
import { createVerifiablePresentation } from "./createVerifiablePresentation";
import { deriveCredential } from "./deriveCredential";
import { verifyPresentation } from "./verifyPresentation";

import * as chapi from "./chapi";

const factoryDefaults = {
  // issuer
  issue,

  // verifier
  verifyCredential,
  verifyPresentation,

  // holder
  createVerifiablePresentation,
  deriveCredential,
  authorizeCredentialFlow: async function(
    flowType: string,
    requiredCredentialTypes: string[]
  ) {
    let create = false;
    let authorizedFlowRequirements = ((this as unknown) as VcWalletFactory).contents.find(
      (c: any) => {
        return c.type === "FlowRequirements";
      }
    );
    if (!authorizedFlowRequirements) {
      create = true;
      authorizedFlowRequirements = {
        type: "FlowRequirements",
        authorized: {},
      };
    }
    const { authorized } = chapi.createFlowRequirements(
      flowType,
      requiredCredentialTypes
    );
    // stateful mutation of content :(
    authorizedFlowRequirements.authorized = {
      ...authorizedFlowRequirements.authorized,
      ...authorized,
    };
    if (create) {
      ((this as unknown) as VcWalletFactory).add(authorizedFlowRequirements);
    }
    return this;
  },
  authorizePresentationFlow: async function(
    controller: string,
    authorizedFlows: string[]
  ) {
    let create = false;
    let authorizedPresenters = ((this as unknown) as VcWalletFactory).contents.find(
      (c: any) => {
        return c.type === "AuthorizedFlows";
      }
    );
    if (!authorizedPresenters) {
      create = true;
      authorizedPresenters = {
        type: "AuthorizedFlows",
        authorized: {},
      };
    }
    const { authorized } = chapi.createAuthorizedFlows(
      controller,
      authorizedFlows
    );
    // stateful mutation of content :(
    authorizedPresenters.authorized = {
      ...authorizedPresenters.authorized,
      ...authorized,
    };
    if (create) {
      ((this as unknown) as VcWalletFactory).add(authorizedPresenters);
    }
    return this;
  },
  createNotificationQueryRequest: function(
    flowType: string,
    flowRecipients?: string[]
  ) {
    return chapi.createNotificationQueryRequest(flowType, flowRecipients);
  },
  // these stateful operations appear to need a loe
  createNotificationQueryResponse: function(
    domain: string,
    flow: CredentialHandlerRequest
  ) {
    const flowRequirements = ((this as unknown) as VcWalletFactory).contents.find(
      (c: any) => {
        return c.type === "FlowRequirements";
      }
    );
    if (!flowRequirements) {
      throw new Error("Wallet does not contain FlowRequirements");
    }
    return chapi.createNotificationQueryResponse(
      flowRequirements,
      domain,
      flow
    );
  },
};

const pluginFactory = Factory.Sync.makeFactory<VcPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { VcPlugin, pluginFactory, factoryDefaults, plugin };
