const { Topics } = require('../models/models');

const getAllTopics = (req, res, next) => {
  Topics.find({}, { _v: false }).lean()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

module.exports = { getAllTopics };