const verifyPresentationChallengesObjectName = "PresentationChallenges";
export const createPendingPresentation = (
  presentationIndex: string,
  query: any
) => {
  return {
    type: verifyPresentationChallengesObjectName,
    pending: {
      [presentationIndex]: query
    }
  };
};
