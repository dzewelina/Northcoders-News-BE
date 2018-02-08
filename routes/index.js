const router = require('express').Router();

router.use('/', (req, res) => res.status(200).send('Northcoders News API'));

module.exports = router;