'use strict';

const mongoose = require('mongoose');

const products = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },  
  category_id: { type: String, required: true},
});

/**
 * @function Post - findOne "record"
 */
products.post('findOne', rec => {
  console.log(`Record found ${rec}`);
});

/**
 * @function  Post - Record not found
 */
products.post('find', () => {
  console.log(`Record not found`);
});


/**
 * @function Post - Save a record
 */
products.post('save', () => {
  console.log('Record saved');
});

module.exports = mongoose.model('product', products);