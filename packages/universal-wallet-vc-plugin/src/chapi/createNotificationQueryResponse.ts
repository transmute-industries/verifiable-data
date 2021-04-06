import { v4 as uuidv4 } from "uuid";
import { CredentialHandlerRequest } from "../types";

export const createNotificationQueryResponse = (
  flowRequirements: any,
  domain: string,
  flow: CredentialHandlerRequest
) => {

  const flowTypes = flowRequirements.authorized[flow.query[0].type];
  if (!flowTypes) {
    throw new Error(`Flow Requirements does not contain ${flow.query[0].type}`);
  }
  return {
    query: [
      {
        type: "QueryByExample",
        credentialQuery: {
          reason: `${domain} is requesting credentials, in response to ${flow.query[0].type}`,
          example: {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            type: flowTypes,
          },
        },
      },
    ],
    challenge: uuidv4(),
    domain: domain,
  };
};
