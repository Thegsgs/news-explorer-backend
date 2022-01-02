const router = require("express").Router();
const auth = require("../middleware/auth");
const { celebrate, Joi } = require("celebrate");
const {
  getArticles,
  saveArticle,
  removeArticle,
} = require("../controllers/articles");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.use(auth);
router.get("/articles", getArticles);

router.post(
  "/articles",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  saveArticle
);

router.delete(
  "/articles/:id",
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  removeArticle
);

module.exports = router;
