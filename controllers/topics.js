const { Topics, Articles } = require('../models/models');

const getAllTopics = (req, res, next) => {
  Topics.find({}, { _v: false }).lean()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  Articles.find({ belongs_to: topic }, { _V: false }).lean()
    .then(articles => res.send({ articles }))
    .catch(err => next(err));
}

module.exports = { getAllTopics, getArticlesByTopic };