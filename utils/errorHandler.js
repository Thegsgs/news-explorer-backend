// Centralized error handling
function errorHandler(err, res) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500
        ? `An error has occured on the server: ${message}`
        : message,
  });
}

module.exports = { errorHandler };
