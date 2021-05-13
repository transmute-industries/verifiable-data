const verifiedPresentationsInboxName = "Submission";
const verifyPresentationChallengesObjectName = "PresentationChallenges";

export const getChallengeForPresentation = (contents: any[], vp: any) => {
  const presentationIndex = `urn:${vp.proof.domain}:${vp.proof.challenge}`;
  const flow = contents.find((c: any) => {
    if (c.type !== verifyPresentationChallengesObjectName) {
      return false;
    }
    if (c.pending[presentationIndex] === undefined) {
      return false;
    }
    return true;
  });
  // should throw if presented a vp for a domain and challenge that are not expected
  // should expire challenges.
  if (flow === undefined) {
    throw new Error("Wallet has no record of this challenge");
  }
  return flow;
};

export const assertPresentationIsAuthorized = (wallet: any, vp: any) => {
  let authorizedFlows = wallet.contents.find((c: any) => {
    return c.type === "AuthorizedFlows";
  });

  if (!authorizedFlows.authorized[vp.holder]) {
    throw new Error(
      `Wallet has no presentation authorizations for ${vp.holder}`
    );
  }
  const flowsHolderIsAuthorizedFor = authorizedFlows.authorized[vp.holder];
  let flowRequirements = wallet.contents.find((c: any) => {
    return c.type === "FlowRequirements";
  });

  const requirementsForFlowsHolderIsAuthorizedFor = flowsHolderIsAuthorizedFor.map(
    (flow: string) => {
      return flowRequirements.authorized[flow];
    }
  );

  const typesInVp = vp.verifiableCredential.map((vc: any) => {
    return vc.type.pop();
  });

  const allowed = new Set(requirementsForFlowsHolderIsAuthorizedFor[0]);
  const submitted = typesInVp;
  const submissionsNotAllowed = submitted.filter((x: any) => !allowed.has(x));
  if (submissionsNotAllowed.length) {
    throw new Error(
      "presentation contained submissions of credentials that holder is not authorized to present."
    );
  }
};

export const verifyAndAddPresentation = async (
  wallet: any,
  presentationSubmission: any,
  options: any,
  requireAuthorization = false
) => {
  const presentation = presentationSubmission.verifiablePresentation;
  const presentationIndex = `urn:${presentation.proof.domain}:${presentation.proof.challenge}`;
  const { pending } = getChallengeForPresentation(
    wallet.contents,
    presentation
  );

  const { domain, challenge } = pending[presentationIndex];

  const verification = await wallet.verifyPresentation({
    presentation,
    options: {
      ...options,
      challenge,
      domain
    }
  });

  if (verification.verified) {
    // now that alice is authenticated, bob checks to see if she
    // presented anything she is not allowed to
    if (requireAuthorization) {
      await assertPresentationIsAuthorized(wallet, presentation);
    }
    // wallet may forward the verified presentation to other systems
    // OR wallet may decide that a human still needs to review
    // this object stores things a human needs to review.
    const flaggedForHumanReview: any = {
      ...presentationSubmission,
      type: verifiedPresentationsInboxName
    };
    wallet.add(flaggedForHumanReview);
  } else {
    console.error(verification);
    throw new Error("Presentation could not be verified");
  }
  // after storing credentials, bob purges expects presentations map
  delete pending[presentationIndex];
  return wallet;
};
