const router = require('express').Router();
const { updateCommentVote } = require('../controllers/comments');

router.route('/:comment_id')
  .put(updateCommentVote);

module.exports = router;