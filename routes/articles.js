const router = require('express').Router();
const { getAllArticles, getCommentsByArticle } = require('../controllers/articles');

router.route('/')
  .get(getAllArticles);

router.route('/:article_id/comments')
  .get(getCommentsByArticle);

module.exports = router;