'use strict';

//this file creates a schema for the database using mongoose

const mongoose = require('mongoose');

const categories = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  displayedName: {type: String},
});

module.exports = mongoose.model('categories', categories);