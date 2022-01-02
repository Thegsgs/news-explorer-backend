const Article = require("../models/article");

const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const handleResponse = (res, dataObj) => res.send({ data: dataObj });

const orFailSettings = () => {
  throw new NotFoundError("No article with this id.");
};

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => handleResponse(res, articles))
    .catch((err) => next(err));
};

const saveArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => handleResponse(res, article))
    .catch((err) => next(err));
};

const removeArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail(orFailSettings)
    .then((article) => {
      if (!article.owner._id.equals(req.user._id)) {
        throw new ForbiddenError("Access forbidden!");
      }
      return Article.findByIdAndDelete(req.params.id).then(() =>
        handleResponse(res, article)
      );
    })
    .catch((err) => next(err));
};

module.exports = { getArticles, saveArticle, removeArticle };
