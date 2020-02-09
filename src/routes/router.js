'use strict';

const express = require('express');
const router = express.Router();

const User = require('../model/userModel.js');
const auth = require('../auth/middleware/auth-middleware.js');
const oauth = require('../auth/oauth/github.js');
const bearerAuth = require('../auth/middleware/bearerAuth.js');

router.get('/users', (req, res, next) => {
  User.find({
    
  }).then(data => {
    const output = {
      count: data.length,
      results: data,
    };
    res.json(output);
  });
});

router.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user
    .save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

router.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

router.get('/user', bearerAuth, (req, res) => {
  res.json(req.user);
});

router.get('/oauth', oauth, (req, res) => {
  res.send(req.token);
});

module.exports = router;