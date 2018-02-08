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
    it('PUT increase or decrease the votes of an article by one', () => {
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
            .put(`/api/articles/${articleId}?vote=down`)
        })
        .then(res => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.article).to.be.an('object');
          expect(res.body.article._id).to.equal(articleId);
          expect(res.body.article.votes).to.equal(0);
        })
    });
  });
});