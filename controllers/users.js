const { Users, Articles } = require('../models/models');

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  Users.findOne({ username }, { __v: false }).lean()
    .then(user => res.send({ user }))
    .catch(next);
};

const getArticlesByUser = (req, res, next) => {
  const { username } = req.params;
  Articles.find({ created_by: username }, { __v: false }).lean()
    .then(articles => res.send({ articles }))
    .catch(next);
};

module.exports = { getUserByUsername, getArticlesByUser };