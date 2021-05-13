import * as Factory from "factory.ts";

import { CredentialHandlerRequest, VpxPlugin, VpxWalletFactory } from "./types";

import { createFlowRequirements } from "./createFlowRequirements";
import { createAuthorizedFlows } from "./createAuthorizedFlows";
import { createNotificationQueryRequest } from "./createNotificationQueryRequest";
import { createNotificationQueryResponse } from "./createNotificationQueryResponse";
import { createPendingPresentation } from "./createPendingPresentation";
import { verifyAndAddPresentation } from "./verifyAndAddPresentation";

const factoryDefaults = {
  authorizeCredentialFlow: async function(
    flowType: string,
    requiredCredentialTypes: string[]
  ) {
    let create = false;
    let authorizedFlowRequirements = ((this as unknown) as VpxWalletFactory).contents.find(
      (c: any) => {
        return c.type === "FlowRequirements";
      }
    );
    if (!authorizedFlowRequirements) {
      create = true;
      authorizedFlowRequirements = {
        type: "FlowRequirements",
        authorized: {}
      };
    }
    const { authorized } = createFlowRequirements(
      flowType,
      requiredCredentialTypes
    );
    // stateful mutation of content :(
    authorizedFlowRequirements.authorized = {
      ...authorizedFlowRequirements.authorized,
      ...authorized
    };
    if (create) {
      ((this as unknown) as VpxWalletFactory).add(authorizedFlowRequirements);
    }
    return this;
  },
  authorizePresentationFlow: async function(
    controller: string,
    authorizedFlows: string[]
  ) {
    let create = false;
    let authorizedPresenters = ((this as unknown) as VpxWalletFactory).contents.find(
      (c: any) => {
        return c.type === "AuthorizedFlows";
      }
    );
    if (!authorizedPresenters) {
      create = true;
      authorizedPresenters = {
        type: "AuthorizedFlows",
        authorized: {}
      };
    }
    const { authorized } = createAuthorizedFlows(controller, authorizedFlows);
    // stateful mutation of content :(
    authorizedPresenters.authorized = {
      ...authorizedPresenters.authorized,
      ...authorized
    };
    if (create) {
      ((this as unknown) as VpxWalletFactory).add(authorizedPresenters);
    }
    return this;
  },
  createNotificationQueryRequest: function(
    flowType: string,
    flowRecipients?: string[]
  ) {
    return createNotificationQueryRequest(flowType, flowRecipients);
  },
  createNotificationQueryResponse: function(
    domain: string,
    flow: CredentialHandlerRequest
  ) {
    let flowTypes: string[] = [];
    try {
      let flowRequirements = ((this as unknown) as VpxWalletFactory).contents.find(
        (c: any) => {
          return c.type === "FlowRequirements";
        }
      );
      if (!flowRequirements) {
        throw new Error("Wallet does not contain FlowRequirements");
      }
      flowTypes = flowRequirements.authorized[flow.query[0].type];
      if (!flowTypes) {
        throw new Error(
          `Flow Requirements does not contain ${flow.query[0].type}`
        );
      }
    } catch (e) {
      // if no flow requirementss accept anything or now.
    }

    const responseFlow = createNotificationQueryResponse(
      flowTypes,
      domain,
      flow
    );
    const presentationIndex = `urn:${responseFlow.domain}:${responseFlow.challenge}`;

    let createPending = false;

    let presentationChallenges = ((this as unknown) as VpxWalletFactory).contents.find(
      (c: any) => {
        return c.type === "PresentationChallenges";
      }
    );
    if (!presentationChallenges) {
      createPending = true;
      presentationChallenges = {
        type: "PresentationChallenges",
        pending: {}
      };
    }

    const newPendingPresentation = createPendingPresentation(
      presentationIndex,
      responseFlow
    );

    presentationChallenges.pending = {
      ...presentationChallenges.pending,
      ...newPendingPresentation.pending
    };

    if (createPending) {
      ((this as unknown) as VpxWalletFactory).add(presentationChallenges);
    }

    return responseFlow;
  },
  verifyAndAddPresentation: async function(
    presentationSubmission: any,
    options: any
  ) {
    return verifyAndAddPresentation(this, presentationSubmission, options);
  }
};

const pluginFactory = Factory.Sync.makeFactory<VpxPlugin>(factoryDefaults);

const plugin = pluginFactory.build();

export { VpxPlugin, pluginFactory, factoryDefaults, plugin };
