const express = require('express');
const app = express();
const endpoints = require('./endpoints.json')
const { getTopics } = require('./controllers/topics.controllers')
const { serverErrorHandler} = require('./controllers/errors.controllers')

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.all("/*", (req, res) => {
    res.status(400).send({msg: 'Invalid request'})
})

app.use(serverErrorHandler)

module.exports = app