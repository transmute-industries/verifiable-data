import {
  resolverFactory,
  Did,
  didUrlToDid,
  dereferencerFactory,
  DidUrl,
  findFirstSubResourceWithId
} from "../";

it("can build a dereferencer from a resolver", async () => {
  const resolver = resolverFactory.build({
    "did:example:": async (did: Did) => {
      return {
        didDocument: {
          id: did,
          verificationMethod: [
            {
              id: did + "/path/123?query=456#fragment-789",
              publicKeyJwk: {
                kty: "OKP",
                crv: "Ed25519",
                x: "gmajf6HkDCPd4-Y6LbJs_rliC_zPyvAPF9jjpBFSYEQ"
              }
            }
          ]
        }
      };
    }
  });
  const dereferencer = dereferencerFactory.build({
    "did:example:": async (didUrl: DidUrl) => {
      const did = didUrlToDid(didUrl);
      const resolution = await resolver.resolve(did);
      return findFirstSubResourceWithId(resolution.didDocument, didUrl);
    }
  });
  const didUrl = "did:example:123/path/123?query=456#fragment-789";
  const dereference = await dereferencer.dereference(didUrl);
  expect(dereference.id).toBe(didUrl);
  expect(dereference.publicKeyJwk).toBeDefined();
});
