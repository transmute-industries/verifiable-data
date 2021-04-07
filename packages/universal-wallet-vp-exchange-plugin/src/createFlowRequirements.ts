export const createFlowRequirements = (
  flowType: string,
  credentialTypes: string[]
) => {
  return {
    type: flowType,
    authorized: {
      IntentToSellProductCategory: credentialTypes
    }
  };
};
