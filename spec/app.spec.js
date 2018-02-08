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

  describe('', () => {
    it('', () => {

    });
  });
});