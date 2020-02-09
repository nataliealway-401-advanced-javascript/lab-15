'use strict';

//his js file makes a schema for the database using mongoose and exports it

const mongoose = require('mongoose');

const products = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  price: { type: Number, required: true},
  category: { type: String },
});

module.exports = mongoose.model('products', products);