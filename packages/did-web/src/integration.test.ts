import { convertDidToEndpoint } from "./convertDidToEndpoint";
import { convertEndpointToDid } from "./convertEndpointToDid";

it("basic", () => {
  const endpoint = convertDidToEndpoint("did:web:api.did.actor:api");
  const did = convertEndpointToDid(endpoint);
  expect(did).toBe("did:web:api.did.actor:api");
});
