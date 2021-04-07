import { createAuthorizedFlows } from "./createAuthorizedFlows";

it("can create a authorized flow requirements", () => {
  const payload = createAuthorizedFlows("did:example:123", [
    "IntentToSellProductCategory"
  ]);
  expect(payload).toEqual({
    type: "AuthorizedFlows",
    authorized: {
      "did:example:123": ["IntentToSellProductCategory"]
    }
  });
});
