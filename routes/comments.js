const router = require('express').Router();
const { updateCommentVote, deleteComment } = require('../controllers/comments');

router.route('/:comment_id')
  .put(updateCommentVote)
  .delete(deleteComment);

module.exports = router;