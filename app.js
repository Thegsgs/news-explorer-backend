require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const { limiter } = require("./utils/rateLimiter");
const routes = require("./routes/index");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { errorHandler } = require("./utils/errorHandler");
const NotFoundError = require("./errors/not-found-err");

const { PORT = 3000, DB_ADDRESS } = process.env;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
mongoose.connect(DB_ADDRESS);
app.use(requestLogger);
app.use(limiter);
app.use(routes);

app.use((err, req, res, next) => {
  errorHandler(err, res);
});
app.use(errorLogger);

app.use(errors());

app.use("*", (req, res) => {
  errorHandler(new NotFoundError(), res);
});

app.listen(PORT);
