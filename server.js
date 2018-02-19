if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;

mongoose.connect(db, { useMongoClient: true })
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

const apiRouter = require('./routes');

const app = express();
app.use(bodyParser.json());

app.route('/')
  .get((req, res) => res.status(200).send({ status: 200, message: 'Working' }));

app.use('/api', apiRouter);
const error = { status: 404, message: 'Page not found' };
app.use('/*', (req, res) => res.status(404).send({ error }));
app.use((err, req, res, next) => res.status(err.error.status || 500).send(err));

module.exports = app;