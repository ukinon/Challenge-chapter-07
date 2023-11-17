const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");
const supertest = require("supertest");
dotenv.config();

let token = "";

beforeAll(async () => {
  const user = {
    email: "jordi7@binar.co.id",
    password: "123456",
  };
  const response = await supertest(app).post("/v1/auth/login").send(user);
  token = response.body.accessToken;
});

describe("API Login", () => {
  it("success login", async () => {
    const user = {
      email: "jordi7@binar.co.id",
      password: "123456",
    };
    const response = await request(app).post("/v1/auth/login").send(user);
    expect(response.statusCode).toBe(201);
  });

  it("failed login : wrong password", async () => {
    const failedUser = {
      email: "fikri@binar.co.id",
      password: "1234656",
    };
    const response = await request(app).post("/v1/auth/login").send(failedUser);
    expect(response.statusCode).toBe(401);
  });

  it("failed login : email not registered", async () => {
    const failedUser = {
      email: "fikria@binar.co.id",
      password: "1234656",
    };
    const response = await request(app).post("/v1/auth/login").send(failedUser);
    expect(response.statusCode).toBe(404);
  });
});

describe("API Register", () => {
  it("success register", async () => {
    const user = {
      name: "jordi",
      email: "jordi26@binar.co.id",
      password: "123456",
      roleId: 2,
    };
    const response = await request(app).post("/v1/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  });

  it("failed register : email has already been taken", async () => {
    const failedUser = {
      name: "test",
      email: "jordi@binar.co.id",
      password: "1234656",
    };
    const response = await request(app)
      .post("/v1/auth/register")
      .send(failedUser);
    expect(response.statusCode).toBe(422);
  });
});

describe("API Get User", () => {
  it("success get user", async () => {
    const response = await request(app)
      .get("/v1/auth/whoami")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("failed get user", async () => {
    const response = await request(app)
      .get("/v1/auth/whoami")
      .set("Authorization", "Bearer abcdefg");
    expect(response.statusCode).toBe(401);
  });
});
