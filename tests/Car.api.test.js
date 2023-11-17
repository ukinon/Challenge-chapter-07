const request = require("supertest");
const app = require("../app");
// const baseURL = "http://localhost:8000"
const dotenv = require("dotenv");
const supertest = require("supertest");
dotenv.config();

// describe("Dog", () => {
//     it("should have name called 'Arnold'", () => {
//         const dog = new Dog("Arnold");

//         expect(dog).toHaveProperty("name", "Arnold");
//     });

//     it("should be able to bark and return 'Woof!'", () => {
//         const dog = new Dog("Arnold");
//         expect(dog.bark()).toEqual("Woof!");
//     });
// });

// describe("API get all cars", () => {
//     it("success get all data cars", (done) => {
//         request(app)
//             .get("/v1/cars")
//             .expect(200, done);
//     });
// });

let token = "";
let tokenAdmin = "";

beforeAll(async () => {
  const user = {
    email: "jordi7@binar.co.id",
    password: "123456",
  };
  const response = await supertest(app).post("/v1/auth/login").send(user);
  token = response.body.accessToken;
});

beforeAll(async () => {
  const user = {
    email: "imam@binar.co.id",
    password: "123456",
  };
  const response = await supertest(app).post("/v1/auth/login").send(user);
  tokenAdmin = response.body.accessToken;
});

describe("API get all cars", () => {
  it("success get all data cars", async () => {
    const response = await request(app).get("/v1/cars");
    expect(response.statusCode).toBe(200);
  });
});

describe("API get car By ID", () => {
  it("success get data car", async () => {
    const response = await request(app).get("/v1/cars/1");
    expect(response.statusCode).toBe(200);
  });
});

describe("API create car", () => {
  it("success create  car", async () => {
    const car = {
      name: "test",
      price: 1,
      size: "l",
      image: "dadadad",
      isCurrentlyRented: false,
    };

    const response = await request(app)
      .post("/v1/cars")
      .send(car)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(201);
  });
  it("failed create  car", async () => {
    const car = {
      name: "test",
      price: 1,
      size: "l",
      image: "dadadad",
      isCurrentlyRented: false,
    };

    const response = await request(app)
      .post("/v1/cars")
      .send(car)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
  });
});

describe("API update car", () => {
  it("success update  car", async () => {
    const car = {
      name: "updatetest",
      price: 182,
      size: "l",
      image: "frepalestine",
    };

    const response = await request(app)
      .put("/v1/cars/393")
      .send(car)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(200);
  });

  it("failed update car", async () => {
    const car = {
      name: "test",
      price: 1,
      size: "l",
      image: "dadadad",
      isCurrentlyRented: false,
    };

    const response = await request(app)
      .put("/v1/cars/193")
      .send(car)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
  });
});

describe("API delete car", () => {
  it("success delete car", async () => {
    const response = await request(app)
      .delete("/v1/cars/11")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(204);
  });

  it("failed delete car", async () => {
    const response = await request(app)
      .delete("/v1/cars/9")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(204);
  });
});

describe("API rent car", () => {
  it("success rent car", async () => {
    const rent = {
      rentStartedAt: new Date().toISOString(),
    };

    const response = await request(app)
      .post("/v1/cars/289/rent")
      .send(rent)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  });
});

describe("random url", () => {
  it("page not found", async () => {
    const response = await request(app).get("/v1/engine");
    expect(response.statusCode).toBe(404);
  });
});

describe("root url", () => {
  it("page not found", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
