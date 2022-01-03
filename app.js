require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");
const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { errorHandler } = require("./utils/errorHandler");

const { PORT = 3000, DB_ADDRESS } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
mongoose.connect(DB_ADDRESS);
app.use(requestLogger);
app.use(limiter);
app.use("/", usersRouter, articlesRouter);

app.use((err, req, res, next) => {
  errorHandler(err, res);
});
app.use(errorLogger);

app.use(errors());

app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.listen(PORT);
