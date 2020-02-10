'use strict';

//dependencies
const express = require('express');
const router = express.Router();

//models
const Categories = require('../../models/categories.js');
const Products = require('../../models/products.js');
const products = new Products();
const categories = new Categories();


// Middleware
const acl = require('../middleware/acl-middleware.js');
const bearerAuth = require('../middleware/bearerAuth.js');


/**
 * @function getModel
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns model
 */
function getModel(req, res, next){
  let model = req.params.model;
  switch(model){
  case 'categories':
    req.model = categories;
    next();
    return;
  case 'products':
    req.model = products;
    next();
    return;
  default:
    next('invalid model');
  }
}

router.param('model', getModel);

// API Routes
router.get('/api/v1/:model', bearerAuth, handleGetAll);
router.post('/api/v1/:model', bearerAuth, acl('create'), handlePost);
router.get('/api/v1/:model/:id', bearerAuth, handleGetOne);
router.put('/api/v1/:model/:id', bearerAuth, acl('update'), handlePut);
router.delete('/api/v1/:model/:id', bearerAuth, acl('delete'), handleDelete);


/**
 * @function handleGetAll
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleGetAll(req, res, next){
  req.model.get()
    .then(records => {
      const output = {
        count: records.length,
        results: records,
      };
      res.status(200).json(output);
    })
    .catch(next);
}
/**
 * @function handleGetOne
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleGetOne(req, res, next){
  let id = req.params.id;
  req.model.get(id)
    .then(result => res.status(200).json(result))
    .catch(next);
}
/**
 * @function handlePost
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handlePost(req, res, next){
  req.model.post(req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}
/**
 * @function handlePut
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handlePut(req, res, next){
  let id = req.params.id;
  req.model.put(id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}
/**
 * @function handleDelete
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleDelete(req, res, next){
  let id = req.params.id;
  req.model.delete(id)
    .then(result => res.status(200).json(result))
    .catch(next);
}




module.exports = router;