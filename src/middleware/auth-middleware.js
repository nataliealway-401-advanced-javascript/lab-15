'use strict';

const base64 = require('base-64');
const User = require('../../model/userModel.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) { 
    next ('Invalid login'); return;
  }
  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  User.authenticateBasic(user, pass)
    .then( validUser => {
      req.token = User.generateToken(validUser);
      next();
    })
    .catch( err => next('Invalid login'));
};