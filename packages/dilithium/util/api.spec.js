const dilithium = require("./api");

describe("module", () => {
  let api;
  it("must init and await before use", async () => {
    expect(dilithium.init).toBeDefined();
    api = await dilithium.init();
    expect(api.version).toBeDefined();
  });
  describe("version", () => {
    it("should return version", async () => {
      const version = await api.version();
      expect(version).toBe(1);
    });
  });

  describe("version", () => {
    it("should generate key", async () => {
      const privateKeyJwk = await api.generate();
      expect(privateKeyJwk.kty).toBe("PQK");
      expect(privateKeyJwk.alg).toBe("CRYDI");
      expect(privateKeyJwk.pset).toBe("3");
      // TODO: add encoded length tests
      expect(privateKeyJwk.xs).toBeDefined();
      expect(privateKeyJwk.ds).toBeDefined();
      expect(privateKeyJwk.x).toBeDefined();
      expect(privateKeyJwk.d).toBeDefined();
    });
  });

  describe("positive verification", () => {
    it("should sign and verify", async () => {
      const privateKeyJwk = await api.generate();
      const message = "hello";
      const signature = await api.sign(message, privateKeyJwk);
      const verified = await api.verify(message, signature, privateKeyJwk);
      expect(verified).toBe(true);
    });
  });

  describe("negative verification", () => {
    it("should fail to verify if tampered", async () => {
      const privateKeyJwk = await api.generate();
      const message = "hello";
      const signature = await api.sign(message, privateKeyJwk);
      const tampered = `deadbeef${signature}`;
      const verified = await api.verify(message, tampered, privateKeyJwk);
      expect(verified).toBe(false);
    });
  });
});
