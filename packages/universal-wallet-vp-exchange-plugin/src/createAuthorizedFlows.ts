export const createAuthorizedFlows = (
  controller: string,
  authorizedFlows: string[]
) => {
  return {
    type: "AuthorizedFlows",
    authorized: {
      [controller]: authorizedFlows
    }
  };
};
