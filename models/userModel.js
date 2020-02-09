'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('./accessModel.js');

const SECRET = 'secretSecretsAreNoFun';
const persistTokens = new Set();

const capabilities = {
  admin: ['create', 'read', 'update', 'delete', 'superuser'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  },
);
/**
 * @param  {} 'userRoles'
 * @object 
 */
userSchema.virtual('userRoles', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'type',
  justOne: true,
});

/**
 * Waits for hashed password then saves the user 
 * @param  {} 'save'
 */
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre('save', join);
userSchema.pre('find', join);

/**
 * Joins user with user role
 * @param  {} next
 */
function join(next) {
  try {
    this.populate('userRoles');
  } catch (error) {
    console.error(error);
  }
  next();
}

/**
 * Finds users email from oath and logs in or creates new user
 * @function createFromOauth
 * @param {} email
 */
userSchema.statics.createFromOauth = function(email) {
  if (!email) {
    return Promise.reject('Validation Error');
  }

  return this.findOne({ email })
    .then(user => {
      if (!user) {
        throw new Error('User Not Found');
      }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      return this.create({ username, password, email });
    });
};

/**
 * Authenticates user
 * @function authenticateBasic
 * @param  {} auth
 */
userSchema.statics.authenticateBasic = function(auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => {
      throw error;
    });
};

/**
 * compares users password
 * @param {} password
 */
userSchema.methods.comparePassword = function(password) {
  return bcrypt
    .compare(password, this.password)
    .then(valid => (valid ? this : null));
};

/**
 * @function authenticateToken
 * @param {} token
 * @returns promise
 */
userSchema.statics.authenticateToken = function(token) {
  try {
    if (persistTokens.has(token)) {
      return Promise.reject('Token has been used');
    }

    let parsedTokenObject = jwt.verify(token, SECRET);

    persistTokens.add(token);

    let query = { _id: parsedTokenObject.id };

    return this.find(query);
  } catch (error) {
    return Promise.reject();
  }
};

/**
 * @function generateToken
 * @returns token, secret, and experation time
 */
userSchema.methods.generateToken = function() {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    username: this.username,
    type: 'user',
  };

  return jwt.sign(token, SECRET, { expiresIn: '15m' });
};

module.exports = mongoose.model('users', userSchema);