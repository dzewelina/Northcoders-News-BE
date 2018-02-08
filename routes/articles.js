const router = require('express').Router();
const { getAllArticles, updateArticleVote, getCommentsByArticle, addComment } = require('../controllers/articles');

router.route('/')
  .get(getAllArticles);

router.route('/:article_id')
  .put(updateArticleVote);

router.route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = router;