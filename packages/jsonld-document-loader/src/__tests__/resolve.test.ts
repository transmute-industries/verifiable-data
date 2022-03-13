import { resolverFactory, Did } from "../";

it("can build resolver with safe types", async () => {
  const resolver = resolverFactory.build({
    "did:example:": async (did: Did) => {
      return { didDocument: { id: did } };
    }
  });
  const resolution = await resolver.resolve("did:example:123");
  expect(resolution.didDocument.id).toBe("did:example:123");
});

it("will throw type error when trying to register unsupported did method", async () => {
  expect.assertions(1);
  const resolver = resolverFactory.build({
    // any required here to turn off the expected type error
    ["did:foo:" as any]: async (did: Did) => {
      return { didDocument: { id: did } };
    }
  });
  try {
    // any required here to turn off the expected type error
    await resolver.resolve("did:foo2:123" as any);
  } catch (e) {
    expect((e as any).message).toBe("Unsupported iri did:foo2:123");
  }
});
