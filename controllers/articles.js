const { Articles } = require('../models/models');

const getAllArticles = (req, res, next) => {
  Articles.find({}, { _v: false }).lean()
    .then(articles => res.send({ articles }))
    .catch(next);
};

module.exports = { getAllArticles };