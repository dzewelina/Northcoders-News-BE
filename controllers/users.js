const { Users, Articles } = require('../models/models');
const { addCommentsNumToArticle } = require('./articles');

const error = (username) => {
  return {
    notExist: { status: 404, message: `User ${username} does not exist` }
  };
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  Users.findOne({ username }, { __v: false }).lean()
    .then(user => {
      if (!user) return next({ error: error(username).notExist });
      res.send({ user });
    })
    .catch(next);
};

const getArticlesByUser = (req, res, next) => {
  const { username } = req.params;

  Users.findOne({ username }).lean()
    .then(user => {
      if (!user) return next({ error: error(username).notExist });
      return;
    })
    .then(() => Articles.find({ created_by: username }, { __v: false }).lean())
    .then(articles => {
      const updatedArticles = articles.map(article => addCommentsNumToArticle(article));
      return Promise.all(updatedArticles);
    })
    .then(articles => res.send({ articles }))
    .catch(next);
};

module.exports = { getUserByUsername, getArticlesByUser };