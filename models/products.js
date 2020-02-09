'use strict';

// this js file is going to import the schema, import stuff from mongo.js, create a model and export it.

const dataModel = require('./mongo.js');
const schema = require('./products-schema.js');

class Products extends dataModel {
  constructor () { super(schema); }

}

module.exports = new Products;