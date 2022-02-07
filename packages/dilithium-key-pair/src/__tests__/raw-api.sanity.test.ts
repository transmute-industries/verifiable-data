const dilithium = require("../../util/api");

it("sanity", async () => {
  const api = await dilithium.init();
  const privateKeyJwk = await api.generate();
  const message = "hello";
  const signature = await api.sign(message, privateKeyJwk);
  const verified = await api.verify(message, signature, privateKeyJwk);
  expect(verified).toBe(true);
});
