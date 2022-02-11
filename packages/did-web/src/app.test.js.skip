const supertest = require("supertest");
const app = require("./app");

console.log = () => {};

describe("demo test", () => {
  beforeAll(() => {
    request = supertest(app);
  });
  afterAll((done) => {
    app.close(done);
  });

  it("returns 200", async () => {
    const response = await request.get("/hello");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "hello" });
  });

  it("handles origin", async () => {
    const response = await request.get("/did:web:vc.did.ai");
    expect(response.status).toBe(302);
  });

  it("handles path", async () => {
    const response = await request.get(
      "/did:web:did.actor:supply-chain:manufacturer:stacy"
    );
    expect(response.status).toBe(302);
  });
});
