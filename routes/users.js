const router = require('express').Router();
const { getUserByUsername } = require('../controllers/users');

router.route('/:username')
  .get(getUserByUsername);

module.exports = router;