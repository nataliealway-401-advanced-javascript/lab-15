'use strict';

//dependencies
const express = require('express');
const router = express.Router();

//models
const categories = require('../../models/categories.js');
const products = require('../../models/products.js');
// const categories = new Categories();
// const products = new Products();

// Esoteric Resources
const errorHandler = require('../middleware/error500.js');
const notFound = require('../middleware/error404.js');

// Auth
const auth = require('../middleware/auth-middleware.js');
const acl = require('../middleware/acl-middleware.js');
const bearerAuth = require('../middleware/bearerAuth.js');
const User = require('../../models/userModel.js');


function getModel(req,res, next){
  const model = req.params.model;
  switch (model) {
  case 'products':
    req.model = products;
    next();
    return;
  case 'categories':
    req.model = categories;
    next();
    return;
  default:
    req.model = 'Invalid Model';
    next();
    return;
  }
}

router.param('model', getModel);

router.get('/api/v1/:model', bearerAuth, handleGetAll);
router.post('/api/v1/:model', bearerAuth, acl('create'), handlePost);
router.get('/api/v1/:model/:id', bearerAuth, handleGetOne);
router.put('/api/v1/:model/:id', bearerAuth, acl('update'), handlePut);
router.delete('/api/v1/:model/:id', bearerAuth, acl('delete'), handleDelete);


router.use(notFound);
router.use(errorHandler);
/**
 * @function handleGetAll
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleGetAll(request, response, next) {
  // expects an array of objects back
  request.model
    .get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}
/**
 * @function handleGetOne
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleGetOne(request, response, next) {
  // expects an array with one object in it
  request.model
    .get(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * @function handlePost
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handlePost(request, response, next) {
  
  request.model
    .post(request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * @function handlePut
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handlePut(request, response, next) {
  // expects the record that was just updated in the database
  request.model
    .put(request.params.id, request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}
/**
 * @function handleDelete
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleDelete(request, response, next) {
  // Expects no return value (the resource should be gone)
  request.model
    .delete(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}



module.exports = router;