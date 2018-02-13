const { Topics, Articles } = require('../models/models');
const { addCommentsNumToArticle } = require('./articles');

const getAllTopics = (req, res, next) => {
  Topics.find({}, { __v: false }).lean()
    .then(topics => res.send({ topics }))
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;

  Topics.find({ slug: topic }).lean()
    .then(topics => {
      if (!topics.length) {
        const error = { status: 404, message: `Topic ${topic} does not exist` };
        return next({ error });
      };
      return;
    })
    .then(() => Articles.find({ belongs_to: topic }, { __v: false }).lean())
    .then(articles => {
      const updatedArticles = articles.map(article => addCommentsNumToArticle(article));
      return Promise.all(updatedArticles);
    })
    .then(articles => res.send({ articles }))
    .catch(next);
};

module.exports = { getAllTopics, getArticlesByTopic };