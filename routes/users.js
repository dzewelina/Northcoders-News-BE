const router = require('express').Router();
const { getUserByUsername, getArticlesByUser } = require('../controllers/users');

router.route('/:username')
  .get(getUserByUsername);

router.route('/:username/articles')
  .get(getArticlesByUser);

module.exports = router;