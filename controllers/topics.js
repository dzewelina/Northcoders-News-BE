const { Topics, Articles } = require('../models/models');

const getAllTopics = (req, res, next) => {
  Topics.find({}, { __v: false }).lean()
    .then(topics => res.send({ topics }))
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  Articles.find({ belongs_to: topic }, { __v: false }).lean()
    .then(articles => res.send({ articles }))
    .catch(next);
}

module.exports = { getAllTopics, getArticlesByTopic };