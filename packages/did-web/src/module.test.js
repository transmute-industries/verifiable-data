const { didToUrl } = require("./index");

it("origin", () => {
  const url = didToUrl("did:web:vc.did.ai");
  expect(url).toBe("https://vc.did.ai/.well-known/did.json");
});

it("path", () => {
  const url = didToUrl("did:web:did.actor:supply-chain:customs:david");
  expect(url).toBe("https://did.actor/supply-chain/customs/david/did.json");
});
