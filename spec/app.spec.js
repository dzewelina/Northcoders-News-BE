process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('../server');
const saveTestData = require('../seed/test.seed');

describe('/api', () => {
  beforeEach(() => {
    return mongoose.connection.db.dropDatabase()
      .then(saveTestData)
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
});