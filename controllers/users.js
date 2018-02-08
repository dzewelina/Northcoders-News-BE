const { Users } = require('../models/models');

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  Users.findOne({ username: username }, { __v: false }).lean()
    .then(user => res.send({ user }))
    .catch(next);
};

module.exports = { getUserByUsername };