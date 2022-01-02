const router = require("express").Router();
const auth = require("../middleware/auth");
const { celebrate, Joi } = require("celebrate");
const { createUser, loginUser, getUserData } = require("../controllers/users");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    }),
  }),
  createUser
);
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser
);

router.get("/users/me", auth, getUserData);

module.exports = router;
