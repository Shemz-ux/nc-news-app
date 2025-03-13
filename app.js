const express = require('express');
const app = express();
const apiRouter = require("./routers/api-router")
const { serverErrorHandler, psqlErrorHandler, customErrorHandler } = require('./controllers/errors.controllers')

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", (req, res) => {
    res.status(404).send({msg: 'Invalid request'})
})

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app