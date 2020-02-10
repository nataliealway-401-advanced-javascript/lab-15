'use strict';

/**
 * @class
 */
class Model {
  constructor(schema) {
    this.schema = schema;
  }

  /**
   *
   * @param {string} _id
   * @returns {object}
   */
  get(_id) {
    if (_id) {
      return this.schema.findOne({ _id });
    } else {
      return this.schema.find({});
    }
  }

  /**
   *
   * @param {object} record
   * @returns {function}
   */
  post(record) {   
    if (typeof record === 'object') {
      let newRecord = new this.schema(record);
      return newRecord.save();
    } else {
      return Error('Invalid record');
    }
  }

  /**
   *
   * @param {string} _id
   * @param {object} record
   * @returns {function}
   */
  put(_id, record) {
    console.log(_id, record);
    if (_id && record) {      
      return this.schema.findByIdAndUpdate(_id, record, { new: true });
    } else {
      return undefined;
    }
  }

  /**
   *
   * @param {string} _id
   * @returns {function}
   */
  delete(_id) {
    if (_id) {
      return this.schema.findByIdAndDelete(_id);
    } else {
      return 'No record found';
    }
  }
}

module.exports = Model;