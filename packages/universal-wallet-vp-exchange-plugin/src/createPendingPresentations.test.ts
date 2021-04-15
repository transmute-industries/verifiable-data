import { createPendingPresentation } from "./createPendingPresentation";
import { createNotificationQueryResponse } from "./createNotificationQueryResponse";
import { createNotificationQueryRequest } from "./createNotificationQueryRequest";

it("can create a notification response", () => {
  const flow = createNotificationQueryRequest("IntentToSellProductCategory");
  const query = createNotificationQueryResponse(
    [
      "IntentToSell",
      "ProductCertificate",
      "InvoiceCertificate",
      "ShippingCertificate"
    ],
    "example.com",
    flow
  );
  const presentationIndex = `urn:${query.domain}:${query.challenge}`;
  const payload = createPendingPresentation(presentationIndex, query);
  expect(payload.type).toBe("PresentationChallenges");
  expect(Object.keys(payload.pending).length).toBe(1);
});
