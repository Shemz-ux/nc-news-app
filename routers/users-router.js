const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users.controllers")

usersRouter
.route("/")
.get(getUsers)

// usersRouter
// .route("/:username")
// .get(getUserByUsername)

module.exports = usersRouter