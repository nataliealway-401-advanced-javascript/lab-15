'use strict';

const express = require('express');
const authRouter = express.Router();

const auth = require('../middleware/auth-middleware.js');
const oauth = require('../middleware/github.js');
const bearerAuth = require('../middleware/bearerAuth.js');
const User = require('../../models/userModel.js');
const Role = require('../../models/accessModel.js');


const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

authRouter.get('/v1/users', (req, res, next) => {
  User.find({}).then(data => {
    const output = {
      count: data.length,
      results: data,
    };
    res.json(output);
  });
});

authRouter.post('/v1/signup', (req, res, next) => {
  let user = new User(req.body);
  user
    .save()
    .then(user => {
      req.token = user.generateToken(req.role);
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

authRouter.post('/v1/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/v1/user', bearerAuth, (req, res) => {
  res.json(req.user);
});

authRouter.get('/v1/oauth', oauth, (req, res) => {
  res.send(req.token);
});

authRouter.post('/v1/roles', (req, res, next) => {
  let saved = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({ type: role, capabilities: capabilities[role] });
    saved.push(newRecord.save());
  });
  Promise.all(saved);
  res.send('Roles Created');
});

module.exports = authRouter;