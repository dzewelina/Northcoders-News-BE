const { Articles, Comments } = require('../models/models');

const addCommentsNumToArticle = async article => {
  const comments = await Comments.find({ belongs_to: article._id }).lean();
  article.comments = comments.length;
  return article;
};

const getAllArticles = (req, res, next) => {
  Articles.find({}, { __v: false }).lean()
    .then(articles => {
      const updatedArticles = articles.map(article => addCommentsNumToArticle(article));
      return Promise.all(updatedArticles);
    })
    .then(articles => res.send({ articles }))
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  Comments.find({ belongs_to: articleId }, { __v: false }).lean()
    .then(comments => res.send({ comments }))
    .catch(next);
};

const addComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = new Comments({
    body: req.body.comment,
    belongs_to: articleId,
  });

  newComment.save()
    .then(comment => res.status(201).send({ comment }))
    .catch(next);
};

const updateArticleVote = (req, res, next) => {
  const articleId = req.params.article_id;
  const vote = req.query.vote;

  Articles.findById(articleId, { __v: false }).lean()
    .then(article => {
      let votesNumber = article.votes;
      if (vote === 'up') votesNumber++;
      if (vote === 'down') votesNumber--;
      return votesNumber;
    })
    .then(newVotes => Articles.findByIdAndUpdate(articleId, { votes: newVotes }))
    .then(() => Articles.findById(articleId, { __v: false }).lean())
    .then(article => addCommentsNumToArticle(article))
    .then(article => res.send({ article }))
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  Articles.findById(articleId, { __v: false }).lean()
    .then(article => addCommentsNumToArticle(article))
    .then(article => res.send({ article }))
    .catch(next);
};

module.exports = { getAllArticles, getCommentsByArticle, addComment, updateArticleVote, getArticleById, addCommentsNumToArticle };