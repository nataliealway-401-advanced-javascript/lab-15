'use strict';

const mongoose = require('mongoose');
/**
 * Schema for a user roles
 * @type mongoose.Schema
 */
const rolesSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['admin', 'editor', 'user'] },
  capabilities: { type: Array, required: true },
});

module.exports = mongoose.model('roles', rolesSchema);