'use strict';

//this file imports schema and creates model

const dataModel = require('./mongo.js');
const schema = require('./schema/categories-schema.js');

class Categories extends dataModel {
  constructor() { super (schema); }
}

module.exports = new Categories;