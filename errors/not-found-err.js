class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = "Requested resource not found.";
  }
}

module.exports = NotFoundError;
