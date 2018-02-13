const { Articles, Comments } = require('../models/models');

const error = (articleId) => {
  return {
    invalid: { status: 400, message: `Article Id ${articleId} is invalid - should have 24 characters` },
    notExist: { status: 404, message: `Article with Id ${articleId} does not exist` }
  };
};

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
  if (articleId.length !== 24) return next({ error: error(articleId).invalid });

  Articles.findById(articleId).lean()
    .then(article => {
      if (!article) return next({ error: error(articleId).notExist });
      return;
    })
    .then(() => Comments.find({ belongs_to: articleId }, { __v: false }).lean())
    .then(comments => res.send({ comments }))
    .catch(next);
};

const addComment = (req, res, next) => {
  const articleId = req.params.article_id;
  if (articleId.length !== 24) return next({ error: error(articleId).invalid });
  if (!req.body.comment || typeof req.body.comment !== 'string') {
    const error = { status: 400, message: 'Comment body must have a comment of type string' };
    return next({ error });
  };

  const newComment = new Comments({
    body: req.body.comment,
    belongs_to: articleId,
  });

  Articles.findById(articleId).lean()
    .then(article => {
      if (!article) return next({ error: error(articleId).notExist });
      return newComment.save();
    })
    .then(comment => {
      if (comment) res.status(201).send({ comment });
    })
    .catch(next);
};

const updateArticleVote = (req, res, next) => {
  const articleId = req.params.article_id;
  if (articleId.length !== 24) return next({ error: error(articleId).invalid });
  const { vote } = req.query;

  Articles.findById(articleId, { __v: false }).lean()
    .then(article => {
      if (!article) return next({ error: error(articleId).notExist });
      let votesNumber = article.votes;
      if (vote === 'up') votesNumber++;
      else if (vote === 'down') votesNumber--;
      else {
        const error = { status: 400, message: 'Vote query requires up or down vote in the format vote=up or vote=down' };
        return next({ error });
      }
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
  if (articleId.length !== 24) return next({ error: error(articleId).invalid });

  Articles.findById(articleId, { __v: false }).lean()
    .then(article => {
      if (!article) return next({ error: error(articleId).notExist });
      return addCommentsNumToArticle(article);
    })
    .then(article => res.send({ article }))
    .catch(next);
};

module.exports = { getAllArticles, getCommentsByArticle, addComment, updateArticleVote, getArticleById, addCommentsNumToArticle };