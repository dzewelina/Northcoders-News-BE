const router = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/', (req, res) => res.status(200).send('Northcoders News API'));

module.exports = router;