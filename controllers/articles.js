const { Articles, Comments } = require('../models/models');

const getAllArticles = (req, res, next) => {
  Articles.find({}, { __v: false }).lean()
    .then(articles => res.send({ articles }))
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  Comments.find({ belongs_to: articleId }, { __v: false }).lean()
    .then(comments => res.send({ comments }))
    .catch(next);
}

module.exports = { getAllArticles, getCommentsByArticle };