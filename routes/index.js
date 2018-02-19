const router = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

router.use('/', (req, res) => res.status(200).sendFile(__dirname + '/index.html'));

module.exports = router;