const apiRouter = require("express").Router()
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")
const topicsRouter = require("./topics-router")
const usersRouter = require("./users-router")
const endpoints = require('../endpoints.json')

apiRouter.use("/articles", articlesRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.get("/", (req, res) => {
    res.status(200).send({endpoints});
  })

module.exports = apiRouter
