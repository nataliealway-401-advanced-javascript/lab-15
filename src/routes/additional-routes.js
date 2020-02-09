'use strict';

const express = require('express');
const router = express.Router();

const bearerAuth = require('../middleware/bearerAuth.js');
const acl = require('../middleware/acl-middleware.js');
const Role = require('../../models/accessModel.js');

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};


router.post('/roles', (req, res, next) => {
  let saved = [];
  Object.keys(capabilities).map(role => {
    let newRecord = new Role({ type: role, capabilities: capabilities[role] });
    saved.push(newRecord.save());
  });
  Promise.all(saved);
  res.send('Roles Created');
});
  
router.get('/public');
  
router.get('/private', bearerAuth, (req, res, next) => {
  res.send('OK');
});
  
router.get('/readonly', bearerAuth, acl('read'), (req, res, next) => {
  res.send('OK');
});
  
router.get('/create', bearerAuth, acl('create'), (req, res, next) => {
  res.send('OK');
});
  
router.post('/update', bearerAuth, acl('update'), (req, res, next) => {
  res.send('OK');
});
  
router.patch('/delete', bearerAuth, acl('delete'), (req, res, next) => {
  res.send('OK');
});
  
router.get('/everything', bearerAuth, acl('superuser'), (req, res, next) => {
  res.send('OK');
});
  
module.exports = router;