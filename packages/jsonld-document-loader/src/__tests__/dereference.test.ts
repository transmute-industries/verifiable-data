import { dereferencerFactory, DidUrl } from "../";

it("can build dereferencer with safe types", async () => {
  const dereferencer = dereferencerFactory.build({
    "did:example:": async (didUrl: DidUrl) => {
      return {
        id: didUrl,
        cool: 123
      };
    }
  });
  const didUrl = "did:example:123/path/123?query=456#fragment-789";
  const dereference = await dereferencer.dereference(didUrl);
  expect(dereference.id).toBe(didUrl);
  expect(dereference.cool).toBe(123);
});

it("will throw type error when trying to register unsupported did method", async () => {
  expect.assertions(1);
  const dereferencer = dereferencerFactory.build({
    // any required here to turn off the expected type error
    ["did:foo:" as any]: async (didUrl: DidUrl) => {
      return { id: didUrl, derp: true };
    }
  });
  try {
    // any required here to turn off the expected type error
    await dereferencer.dereference("did:foo2:123" as any);
  } catch (e) {
    expect((e as any).message).toBe("Unsupported iri did:foo2:123");
  }
});
