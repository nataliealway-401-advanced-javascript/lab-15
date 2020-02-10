'use strict';


const mongoose = require('mongoose');
const products = require('./products-schema.js');

const categories = new mongoose.Schema({  
  category_id: { type: String, required: true},
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  quantity_in_stock: { type: Number, required: true },
  
},
{toObject: {virtuals: true}, toJSON: {virtuals: true}},
);

categories.virtual('products', {
  ref: products,
  localField: 'category_id',
  foreignField: 'category_id',  
  
});

function join(){
  try {
    this.populate('products');
  }
  catch (e) {console.log(e);}
}

categories.pre('find', join);
categories.pre('findOne', join);
/**
 * @function 
 */
categories.post('findOne', rec => {
  console.log(`Record found ${rec}`);
});

/**
 * @function 
 */
categories.post('find', () => {
  console.log(`Record not found`);
});

/**
 * @function 
 */
categories.post('save', () => {
  console.log('Record saved');
});
module.exports = mongoose.model('categories', categories);