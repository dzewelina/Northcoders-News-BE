const router = require('express').Router();
const { getAllArticles, getCommentsByArticle, addComment } = require('../controllers/articles');

router.route('/')
  .get(getAllArticles);

router.route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = router;