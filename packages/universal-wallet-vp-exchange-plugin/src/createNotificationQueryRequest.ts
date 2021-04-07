export const createNotificationQueryRequest = (
  flowType: string,
  flowRecipients?: string[]
) => {
  const payload: any = {
    query: [
      {
        type: flowType
      }
    ]
  };
  if (flowRecipients !== undefined) {
    payload.recipients = flowRecipients;
  }
  return payload;
};
