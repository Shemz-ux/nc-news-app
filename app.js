const express = require('express');
const app = express();
const endpoints = require('./endpoints.json')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticleById, getArticles, patchArticleById } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comments.controllers')
const { serverErrorHandler, psqlErrorHandler, customErrorHandler } = require('./controllers/errors.controllers')

app.use(express.json())

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/*", (req, res) => {
    res.status(404).send({msg: 'Invalid request'})
})

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app