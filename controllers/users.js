const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const handleResponse = (res, dataObj) => res.send({ data: dataObj });

const orFailSettings = () => {
  throw new NotFoundError("No user with that id.");
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(password, 10)
          .then((hash) => User.create({ email, name, password: hash }))
          .then((createdUser) =>
            handleResponse(res, {
              email: createdUser.email,
              name: createdUser.name,
              _id: createdUser._id,
            })
          )
          .catch((err) => next(err));
      }
      throw new ConflictError("User already exists!");
    })
    .catch((err) => next(err));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findByCredentials({ email, password })
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          }
        ),
      });
    })
    .catch((err) => next(err));
};

const getUserData = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => next(err));
};

module.exports = { createUser, loginUser, getUserData };
