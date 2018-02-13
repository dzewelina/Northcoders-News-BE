process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('../server');
const saveTestData = require('../seed/test.seed');

describe('/api', () => {
  let data;

  beforeEach(() => {
    return mongoose.connection.db.dropDatabase()
      .then(saveTestData)
      .then(savedData => data = savedData)
      .catch(console.log);
  });

  after(() => {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe('/topics', () => {
    it('GET returns an object with all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
        });
    });
  });

  describe('/topics/:topic/articles', () => {
    it('GET returns an object with all articles for a certain topic', () => {
      return request(app)
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].belongs_to).to.equal('cats');
        });
    });
    it('GET returns an object with error status 404 and message if given topic does not exist', () => {
      return request(app)
        .get('/api/topics/carrot/articles')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Topic carrot does not exist');
        });
    });
  });

  describe('/articles', () => {
    it('GET returns an object with all articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(2);
        });
    });
  });

  describe('/articles/:article_id', () => {
    it('GET returns an object with article with given id', () => {
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article._id).to.equal(articleId);
        });
    });
    it('GET returns an object with error status 404 and message if given article Id does not exist', () => {
      return request(app)
        .get('/api/articles/123456789012345678901234')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article with Id 123456789012345678901234 does not exist');
        });
    });
    it('GET returns an object with error status 400 and message if given article Id is invalid', () => {
      return request(app)
        .get('/api/articles/12345678901234567890123')
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('PUT increases or decreases the votes of an article by one', () => {
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .put(`/api/articles/${articleId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article._id).to.equal(articleId);
          expect(res.body.article.votes).to.equal(1);
          return request(app)
            .put(`/api/articles/${articleId}?vote=down`);
        })
        .then(res => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article._id).to.equal(articleId);
          expect(res.body.article.votes).to.equal(0);
        });
    });
    it('PUT returns an object with error status 404 and message if given article Id does not exist', () => {
      return request(app)
        .put('/api/articles/123456789012345678901234?vote=up')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article with Id 123456789012345678901234 does not exist');
        });
    });
    it('PUT returns an object with error status 400 and message if given article Id is invalid', () => {
      return request(app)
        .put('/api/articles/12345678901234567890123?vote=up')
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('PUT returns an object with error status 400 and message if given query is invalid', () => {
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .put(`/api/articles/${articleId}?bote=down`)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Vote query requires up or down vote in the format vote=up or vote=down');
        });
    });
  });

  describe('/articles/:article_id/comments', () => {
    it('GET returns an object with all comments for a certain article', () => {
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comments).to.be.an('array');
          expect(res.body.comments[0].belongs_to).to.eql(articleId);
          expect(res.body.comments.length).to.equal(2);
        });
    });
    it('GET returns an object with error status 404 and message if given article Id does not exist', () => {
      return request(app)
        .get('/api/articles/123456789012345678901234/comments')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article with Id 123456789012345678901234 does not exist');
        });
    });
    it('GET returns an object with error status 400 and message if given article Id is invalid', () => {
      return request(app)
        .get('/api/articles/12345678901234567890123/comments')
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('POST adds a new comment to an article and returns an object with new comment', () => {
      const newComment = { comment: 'This is my new comment' };
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment.body).to.equal('This is my new comment');
          expect(res.body.comment.belongs_to).to.equal(articleId);
          expect(res.body.comment.votes).to.equal(0);
          expect(res.body.comment.created_by).to.equal('northcoder');
          return request(app)
            .get(`/api/articles/${articleId}/comments`);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(3);
        });
    });
    it('POST returns an object with error status 404 and message if given article Id does not exist', () => {
      const newComment = { comment: 'This is my new comment' };
      return request(app)
        .post('/api/articles/123456789012345678901234/comments')
        .send(newComment)
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article with Id 123456789012345678901234 does not exist');
        });
    });
    it('POST returns an object with error status 400 and message if given article Id is invalid', () => {
      const newComment = { comment: 'This is my new comment' };
      return request(app)
        .post('/api/articles/12345678901234567890123/comments')
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Article Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('POST returns an object with error status 400 and message if new comment is invalid - no body', () => {
      const articleId = data.articles[0]._id.toString();
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment body must have a comment of type string');
        });
    });
    it('POST returns an object with error status 400 and message if new comment is invalid - empty body', () => {
      const articleId = data.articles[0]._id.toString();
      const newComment = {};
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment body must have a comment of type string');
        });
    });
    it('POST returns an object with error status 400 and message if new comment is invalid - empty comment', () => {
      const articleId = data.articles[0]._id.toString();
      const newComment = { comment: '' };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment body must have a comment of type string');
        });
    });
    it('POST returns an object with error status 400 and message if new comment is invalid - comment is not a string', () => {
      const articleId = data.articles[0]._id.toString();
      const newComment = { comment: 123 };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment body must have a comment of type string');
        });
    });
  });

  describe('/comments/:comment_id', () => {
    it('PUT increases or decreases the votes of a comment by one', () => {
      const commentId = data.comments[0]._id.toString();
      return request(app)
        .put(`/api/comments/${commentId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment._id).to.equal(commentId);
          expect(res.body.comment.votes).to.equal(1);
          return request(app)
            .put(`/api/comments/${commentId}?vote=down`);
        })
        .then(res => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.comment).to.be.an('object');
          expect(res.body.comment._id).to.equal(commentId);
          expect(res.body.comment.votes).to.equal(0);
        });
    });
    it('PUT returns an object with error status 404 and message if given article Id does not exist', () => {
      return request(app)
        .put('/api/comments/123456789012345678901234?vote=up')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment with Id 123456789012345678901234 does not exist');
        });
    });
    it('PUT returns an object with error status 400 and message if given article Id is invalid', () => {
      return request(app)
        .put('/api/comments/12345678901234567890123?vote=up')
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('PUT returns an object with error status 400 and message if given query is invalid', () => {
      const commentId = data.comments[0]._id.toString();
      return request(app)
        .put(`/api/comments/${commentId}?bote=down`)
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Vote query requires up or down vote in the format vote=up or vote=down');
        });
    });
    it('DELETE deletes a certain comment', () => {
      const commentId = data.comments[0]._id.toString();
      const { Comments } = require('../models/models');
      return request(app)
        .delete(`/api/comments/${commentId}`)
        .then(() => Comments.find({}).lean())
        .then(comments => {
          expect(comments.length).to.equal(1);
        });
    });
    it('DELETE returns an object with error status 404 and message if given article Id does not exist', () => {
      return request(app)
        .delete('/api/comments/123456789012345678901234')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment with Id 123456789012345678901234 does not exist');
        });
    });
    it('DELETE returns an object with error status 400 and message if given article Id is invalid', () => {
      return request(app)
        .delete('/api/comments/12345678901234567890123')
        .expect(400)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('Comment Id 12345678901234567890123 is invalid - should have 24 characters');
        });
    });
    it('DELETE returns an object with error status 401 and message if user is not authorised to delete comment', () => {
      const commentId = data.comments[1]._id.toString();
      return request(app)
        .delete(`/api/comments/${commentId}`)
        .expect(401)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('User is not authorised to delete this comment');
        });
    });
  });

  describe('/users/:username', () => {
    it('GET returns an object with the profile data for the specified user ', () => {
      const { username } = data.user;
      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.user).to.be.an('object');
          expect(res.body.user.username).to.equal(username);
        });
    });
    it('GET returns an object with error status 404 and message if given user does not exist', () => {
      return request(app)
        .get('/api/users/carrot')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('User carrot does not exist');
        });
    });
  });

  describe('/users/:username/articles', () => {
    it('GET returns an object with all articles for a specified user', () => {
      const { username } = data.user;
      return request(app)
        .get(`/api/users/${username}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].created_by).to.equal(username);
        });
    });
    it('GET returns an object with error status 404 and message if given user does not exist', () => {
      return request(app)
        .get('/api/users/carrot/articles')
        .expect(404)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.message).to.equal('User carrot does not exist');
        });
    });
  });
});