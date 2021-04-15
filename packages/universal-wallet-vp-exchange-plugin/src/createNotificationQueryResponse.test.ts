import { createNotificationQueryResponse } from "./createNotificationQueryResponse";
import { createNotificationQueryRequest } from "./createNotificationQueryRequest";
it("can create a notification response", () => {
  const flow = createNotificationQueryRequest("IntentToSellProductCategory");
  const payload = createNotificationQueryResponse(
    [
      "IntentToSell",
      "ProductCertificate",
      "InvoiceCertificate",
      "ShippingCertificate"
    ],
    "example.com",
    flow
  );
  expect(payload.query).toEqual([
    {
      type: "QueryByExample",
      credentialQuery: {
        reason:
          "example.com is requesting credentials, in response to IntentToSellProductCategory",
        example: {
          "@context": ["https://www.w3.org/2018/credentials/v1"],
          type: [
            "IntentToSell",
            "ProductCertificate",
            "InvoiceCertificate",
            "ShippingCertificate"
          ]
        }
      }
    }
  ]);
  expect(payload.domain).toBe("example.com");
  expect(payload.challenge).toBeDefined();
});
