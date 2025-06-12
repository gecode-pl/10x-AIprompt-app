const request = require("supertest");
const app = require("../app");

describe("Prompt API", () => {
  it("should return 401 for unauthorized GET", async () => {
    const res = await request(app).get("/api/prompts");
    expect(res.statusCode).toBe(401);
  });
});
