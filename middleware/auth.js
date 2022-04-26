const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = () => {
  throw new UnauthorizedError("Authorization Error");
};

const extractToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError();
  }

  const token = extractToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  return next();
};
