import { v4 as uuidv4 } from "uuid";
import { CredentialHandlerRequest } from "./types";

export const createNotificationQueryResponse = (
  flowTypes: string[],
  domain: string,
  flow: CredentialHandlerRequest
) => {
  return {
    query: [
      {
        type: "QueryByExample",
        credentialQuery: {
          reason: `${domain} is requesting credentials, in response to ${flow.query[0].type}`,
          example: {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            type: flowTypes
          }
        }
      }
    ],
    challenge: uuidv4(),
    domain: domain
  };
};
