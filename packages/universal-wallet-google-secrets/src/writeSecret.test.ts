import { pluginFactory } from "./index";

const wallet = pluginFactory.build();

wallet.writeSecret = jest.fn(
  (projectId: string, secretId: string, value: string) => {
    return Promise.resolve({
      "@context": ["https://w3id.org/wallet/v1"],
      id: `urn:google:projects/${projectId}/secrets/${secretId}/versions/1`,
      type: "GoogleCloudSecret",
      tags: ["google"],
      value
    });
  }
);

it("can write secret by name", async () => {
  const s0 = await wallet.writeSecret(
    "555555555555",
    "seed",
    "7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226"
  );
  expect(s0.type).toBe("GoogleCloudSecret");
  expect(s0.tags).toEqual(["google"]);
  expect(s0.value).toBe(
    "7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226"
  );
});
