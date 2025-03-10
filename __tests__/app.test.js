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
  test("200: Responds with an array of topic objects, each of which contain a slug and description" , () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body})=>{
      const {topics} = body
      expect(topics).toHaveLength(3)
      topics.forEach((snack)=>{
        expect(typeof snack.slug).toBe('string')
        expect(typeof snack.description).toBe('string')
      })
    })
  })
})

describe("404 invalid endpoint /api/banana", () => {
  test("404: Responds with a 404 error when an invalid request is made to this endpoint", () => {
    return request(app)
    .get("/api/bananas")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing the data by it article_id", () => {
    return request(app)
    .get("/api/articles/4")
    .expect(200)
    .then(({body})=>{
      console.log(body)
      const {author, title, article_id, created_at, votes, article_img_url } = body.topic
      expect(typeof author).toBe('string')
      expect(typeof title).toBe('string')
      expect(typeof article_id).toBe('number')
      expect(typeof created_at).toBe('string')
      expect(typeof votes).toBe('number')
      expect(typeof article_img_url).toBe('string')
    })
  })

  test("400: Responds with an error when an invalid Id is used", () => {
    return request(app)
    .get("/api/articles/apples")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Responds with an error when the article does not exist", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body})=>{
      console.log(body)
      expect(body.msg).toBe('Not found')
    })
  })
})
