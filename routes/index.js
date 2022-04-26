const router = require("express").Router();
const articlesRouter = require("./articles");
const usersRouter = require("./users");

router.use("/", usersRouter, articlesRouter);

module.exports = router;
