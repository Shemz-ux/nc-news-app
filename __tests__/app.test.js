const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data")
require('jest-sorted')
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

describe("404 invalid endpoints", () => {
  test("404: Responds with a 404 error when an invalid request is made to this endpoint", () => {
    return request(app)
    .get("/api/bananas")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Responds with a 404 error when articles is misspelled", () => {
    return request(app)
    .get("/api/artcles")
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
      const {author, title, article_id, created_at, votes, article_img_url } = body.article
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
      expect(body.msg).toBe('Not found')
    })
  })

  test("200: returns an object containing the comment_count property, which is the total count of all the comments with this article_id", ()=>{
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body})=>{
      const {comment_count} = body.article
      expect(typeof comment_count).toBe('number')
      expect(comment_count).toBe(2)
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects in correct order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      const { articles } = body
      expect(articles).toHaveLength(13)
      expect(articles).toBeSorted({ descending: true, key: 'created_at' })
      articles.forEach((article)=>{
        expect(typeof article.author).toBe('string')
        expect(typeof article.title).toBe('string')
        expect(typeof article.article_id).toBe('number')
        expect(typeof article.topic).toBe('string')
        expect(typeof article.created_at).toBe('string')
        expect(typeof article.votes).toBe('number')
        expect(typeof article.article_img_url).toBe('string')
        expect(typeof article.comment_count).toBe('number')
      })
    })
  })
  test("200: Responds with an array of articles sorted by the created_at columns which defaults to descending", () => {
    return request(app)
  .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({body})=>{
        expect(body.articles).toBeSorted({descending: true, key: 'created_at'})
      })
    })

    test("200: Responds with an array of articles sorted by the article_id in descending order", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({body})=>{
          expect(body.articles).toBeSorted({descending: true, key: 'article_id'})
        })
      })

    test("200: Responds with an array of articles sorted by the votes from highest to lowest vote", () => {
      return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({body})=>{
          expect(body.articles).toBeSorted({descending: true, key: 'votes'})
        })
      })

    test("200: Responds with an array of articles sorted by the date, in ascending order when an order query is used", () => {
      return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({body})=>{
          expect(body.articles).toBeSorted({descending: false, key: 'created_at'})
        })
      })

    test("200: Responds with an array of articles sorted by the article_id, in ascending order when an order query is used", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({body})=>{
          expect(body.articles).toBeSorted({descending: false, key: 'article_id'})
        })
      })

    test("400: Throws an error when given an invalid query statement due to mispellings", () => {
      return request(app)
      .get("/api/articles?sort_by=artecle_id&order=asc")
      .expect(400)
      .then(({body})=>{
          expect(body.msg).toBe('Invalid query')
        })
      })

    test("200: Responds with an array of objects which filters the articles by the topic 'mitch' ", ()=>{
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body})=>{
          body.articles.forEach((article)=>{
            expect(article.topic).toBe('mitch')
          })
        })
    })

    test("400: throws an error when an invalid topic is used to filter through the articles ", ()=>{
      return request(app)
      .get("/api/articles?topic=apple")
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid query')
      })
  })
  })

describe("GET /api/articles/:article_id/comment", () => {
  test("200: Responds with an array of comment objects", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({body})=>{
      const { comments } = body
      expect(comments.length).toBeGreaterThan(0)
      expect(comments).toBeSorted({ descending: true, key: 'created_at' })
      comments.forEach((comment)=>{
        expect(typeof comment.comment_id).toBe('number')
        expect(typeof comment.votes).toBe('number')
        expect(typeof comment.created_at).toBe('string')
        expect(typeof comment.author).toBe('string')
        expect(typeof comment.body).toBe('string')
        expect(comment.article_id).toBe(3)
      })
    })
  })

  test("400: Returns an error due to an invalid article_id", () => {
    return request(app)
    .get("/api/articles/hello/comments")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Returns an error when asked to find a comment for an article id that does not exist", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not found')
    })
  })
})

describe("POST /api/articles/:article_id/comment", () => {
  test("200: Responds with an object containing details of the posted comments", () => {
    return request(app)
    .post("/api/articles/3/comments")
    .send({ username: 'Test subject', body: 'northcoders' })
    .expect(201)
    .then(({ body })=>{
      const {author, comment_id, article_id, votes} = body.newComment
      expect(comment_id).toBe(19)
      expect(article_id).toBe(3)
      expect(votes).toBe(0)
      expect(author).toBe('icellusedkars')
    })
  })

  test("400: Returns an error due to an invalid article_id", () => {
    return request(app)
    .post("/api/articles/hellow/comments")
    .send({ username: 'Test subject', body: 'northcoders' })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Returns an error due to client trying to post a comment for an article that does not exist", () => {
    return request(app)
    .post("/api/articles/1000/comments")
    .send({ username: 'Test subject', body: 'northcoders' })
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not found')
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("201: Responds with an object containing the updated article with vote increased by 5", () => {
    return request(app)
    .patch("/api/articles/4")
    .send({inc_votes: 5 })
    .expect(201)
    .then(({body})=>{
      const {article} = body
      expect(article.article_id).toBe(4)
      expect(article.votes).toBe(5)
    })
  })

  test("201: Responds with an object containing the updated article with vote decreased by -100", () => {
    return request(app)
    .patch("/api/articles/6")
    .send({inc_votes: -100 })
    .expect(201)
    .then(({body})=>{
      const {article} = body
      expect(article.article_id).toBe(6)
      expect(article.votes).toBe(-100)
    })
  })

  test("400: Returns an error due to an invalid article_id", () => {
    return request(app)
    .patch("/api/articles/hi")
    .send({inc_votes: 5 })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("400: Returns an error due to an invalid inc_votes value", () => {
    return request(app)
    .patch("/api/articles/4")
    .send({inc_votes: 'abc' })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Returns an error due to article id not existing", () => {
    return request(app)
    .patch("/api/articles/1000")
    .send({inc_votes: 5 })
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not found')
    })
  })

})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with 204 and message stating no content", () =>{
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
    .then(({res})=>{
      expect(res.statusMessage).toBe('No Content')
    })
  })

  test("400: Responds with 400 error due to an invalid comment_id being used to delete data", () =>{
    return request(app)
    .delete("/api/comments/abc")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })

  test("404: Responds with 404 error as comment being deleted does not exist", () =>{
    return request(app)
    .delete("/api/comments/1000")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not found')
    })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an array of objects containing the username, name and avatar properties", ()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body})=>{
      expect(body.users).toHaveLength(4)
      body.users.forEach((user)=>{
        expect(typeof user.username).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
      })

    })
  })

  test("404: Responds with 404 error due mispelling the users endpoint (caught by app.all function)", () =>{
    return request(app)
    .get("/api/usrs")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid request')
    })
  })
})
