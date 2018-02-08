const router = require('express').Router();
const { getAllArticles, getArticleById, updateArticleVote, getCommentsByArticle, addComment } = require('../controllers/articles');

router.route('/')
  .get(getAllArticles);

router.route('/:article_id')
  .get(getArticleById)
  .put(updateArticleVote);

router.route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = router;