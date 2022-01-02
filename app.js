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

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
mongoose.connect("mongodb://localhost:27017/newsdb");
app.use(requestLogger);

app.use("/", usersRouter, articlesRouter);

app.use(errorLogger);
// Centralized error handling
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).send({ message: "Invalid object" });
  } else {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message:
        statusCode === 500
          ? `An error has occured on the server: ${message}`
          : message,
    });
  }
});
app.use(errors());

app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.listen(PORT);