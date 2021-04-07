import { createPendingPresentation } from "./createPendingPresentation";
import { createFlowRequirements } from "./createFlowRequirements";
import { createNotificationQueryResponse } from "./createNotificationQueryResponse";
import { createNotificationQueryRequest } from "./createNotificationQueryRequest";

it("can create a notification response", () => {
  const flowRequirements = createFlowRequirements(
    "IntentToSellProductCategory",
    [
      "IntentToSell",
      "ProductCertificate",
      "InvoiceCertificate",
      "ShippingCertificate"
    ]
  );
  const flow = createNotificationQueryRequest("IntentToSellProductCategory");
  const query = createNotificationQueryResponse(
    flowRequirements,
    "example.com",
    flow
  );
  const presentationIndex = `urn:${query.domain}:${query.challenge}`;
  const payload = createPendingPresentation(presentationIndex, query);
  expect(payload.type).toBe("PresentationChallenges");
  expect(Object.keys(payload.pending).length).toBe(1);
});
