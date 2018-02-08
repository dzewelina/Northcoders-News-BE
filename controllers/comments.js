const { Comments } = require('../models/models');

const updateCommentVote = (req, res, next) => {
  const commentId = req.params.comment_id;
  const vote = req.query.vote;

  Comment.findById(commentId, { __v: false }).lean()
    .then(comment => {
      if (vote === 'up') comment.votes++;
      if (vote === 'down') comment.votes--;
      res.send({ comment })
    })
    .catch(next);
};

module.exports = { updateCommentVote };