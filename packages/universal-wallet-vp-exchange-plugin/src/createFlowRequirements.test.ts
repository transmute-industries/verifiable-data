import { createFlowRequirements } from "./createFlowRequirements";

it("can create a authorized flow requirements", () => {
  const payload = createFlowRequirements("IntentToSellProductCategory", [
    "IntentToSell",
    "ProductCertificate",
    "InvoiceCertificate",
    "ShippingCertificate"
  ]);
  expect(payload).toEqual({
    type: "IntentToSellProductCategory",
    authorized: {
      IntentToSellProductCategory: [
        "IntentToSell",
        "ProductCertificate",
        "InvoiceCertificate",
        "ShippingCertificate"
      ]
    }
  });
});
