const router = require('express').Router();
const topicsRouter = require('./topics');

router.use('/topics', topicsRouter);
router.use('/', (req, res) => res.status(200).send('Northcoders News API'));

module.exports = router;