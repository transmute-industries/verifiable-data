import { createNotificationQueryRequest } from "./createNotificationQueryRequest";
it("can create a notification of an available presentation flow", () => {
  const payload = createNotificationQueryRequest("IntentToSellProductCategory");
  expect(payload).toEqual({ query: [{ type: "IntentToSellProductCategory" }] });
});
