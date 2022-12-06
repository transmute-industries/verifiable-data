import { convertDidToEndpoint } from "./convertDidToEndpoint";
import { convertEndpointToDid } from "./convertEndpointToDid";

it("basic", () => {
  const endpoint = convertDidToEndpoint("did:web:api.did.actor:api");
  const did = convertEndpointToDid(endpoint);
  expect(did).toBe("did:web:api.did.actor:api");
});

it("with port", () => {
  const endpoint = convertDidToEndpoint("did:web:api.did.actor%3A8080:api");
  const did = convertEndpointToDid(endpoint);
  expect(did).toBe("did:web:api.did.actor%3A8080:api");
});
