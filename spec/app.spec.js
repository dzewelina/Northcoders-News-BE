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
      .catch(console.log)
  });

  after(() => {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect())
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
        })
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
  });
});