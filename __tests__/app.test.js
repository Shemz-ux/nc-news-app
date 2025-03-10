const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed.js")

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(data)
})

afterAll(()=>{
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Response with an array of topic objects, each of which contain a slug and description" , () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body})=>{
      const {topics} = body
      topics.forEach((snack)=>{
        expect(typeof snack.slug).toBe('string')
        expect(typeof snack.description).toBe('string')
      })
    })
  })

  test("400: Responds with a 400 error when an invalid request is made to this endpoint", () => {
    return request(app)
    .get("/api/bananas")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })
})
