// Centralized error handling
function errorHandler(err, req, res, next) {
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
}

module.exports = { errorHandler };
