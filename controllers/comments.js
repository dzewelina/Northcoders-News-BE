const { Comments } = require('../models/models');

const error = (commentId) => {
  return {
    invalid: { status: 400, message: `Comment Id ${commentId} is invalid - should have 24 characters` },
    notExist: { status: 404, message: `Comment with Id ${commentId} does not exist` }
  };
};

const updateCommentVote = (req, res, next) => {
  const commentId = req.params.comment_id;
  if (commentId.length !== 24) return next({ error: error(commentId).invalid });
  const { vote } = req.query;

  Comments.findById(commentId, { __v: false }).lean()
    .then(comment => {
      if (!comment) return next({ error: error(commentId).notExist });
      let votesNumber = comment.votes;
      if (vote === 'up') votesNumber++;
      else if (vote === 'down') votesNumber--;
      else {
        const error = { status: 400, message: 'Vote query requires up or down vote in the format vote=up or vote=down' };
        return next({ error });
      }
      return votesNumber;
    })
    .then(newVotes => Comments.findByIdAndUpdate(commentId, { votes: newVotes }))
    .then(() => Comments.findById(commentId))
    .then(comment => res.send({ comment }))
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  if (commentId.length !== 24) return next({ error: error(commentId).invalid });

  Comments.findById(commentId, { __v: false }).lean()
    .then(comment => {
      if (!comment) return next({ error: error(commentId).notExist });
      else if (comment.created_by !== 'northcoder') {
        const error = { status: 401, message: 'User is not authorised to delete this comment' };
        return next({ error });
      }
      else return Comments.remove({ _id: commentId });
    })
    .then(result => {
      if (result) res.end();
    })
    .catch(next);
};

module.exports = { updateCommentVote, deleteComment };