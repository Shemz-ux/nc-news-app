const express = require('express');
const app = express();
const endpoints = require('./endpoints.json')
const { getTopics, getTopicById } = require('./controllers/topics.controllers')
const { serverErrorHandler, psqlErrorHandler, customErrorHandler } = require('./controllers/errors.controllers')

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getTopicById)

app.all("/*", (req, res) => {
    res.status(404).send({msg: 'Invalid request'})
})

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app