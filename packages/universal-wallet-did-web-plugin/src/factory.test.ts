import { pluginFactory } from "./factory";

jest.setTimeout(10 * 1000);

it("can generate", async () => {
  const { keys, didDocument } = await pluginFactory
    .build()
    .generate("https://example.com/organizations/123/did.json");

  expect(keys).toBeDefined();
  expect(didDocument).toBeDefined();
});
