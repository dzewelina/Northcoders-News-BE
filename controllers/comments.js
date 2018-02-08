const { Comments } = require('../models/models');

const updateCommentVote = (req, res, next) => {
  const commentId = req.params.comment_id;
  const { vote } = req.query;

  Comments.findById(commentId, { __v: false }).lean()
    .then(comment => {
      let votesNumber = comment.votes;
      if (vote === 'up') votesNumber++;
      if (vote === 'down') votesNumber--;
      return votesNumber;
    })
    .then(newVotes => Comments.findByIdAndUpdate(commentId, { votes: newVotes }))
    .then(() => Comments.findById(commentId))
    .then(comment => res.send({ comment }))
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  Comments.findById(commentId, { __v: false }).lean()
    .then(comment => {
      if (comment.created_by === 'northcoder') return Comments.remove({ _id: commentId });
      else res.send({ reason: 'User not authorised to delete' });
    })
    .then(() => res.end())
    .catch(next);
};

module.exports = { updateCommentVote, deleteComment };