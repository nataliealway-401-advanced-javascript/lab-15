'use strict';


class Model {
  constructor(schema){
    this.schema = schema;
  }

  get(_id){
    if(_id){
      return this.schema.findOne( {_id} );
    }
    else return this.schema.find({});
  }

  post(record){
    let newObject = new this.schema(record);
    return newObject.save();
  }
  
 
  put(_id, record){
    if(_id && record){
      return this.schema.findByIdAndUpdate(_id, record, {new: true});
    }
    else {
      return undefined;
    }
  }

  delete(_id){
    if(_id){
      return this.schema.findByIdAndDelete(_id);
    }
    else {
      return 'invalid record, try again';
    }
  }
}

/** 
 * @module Model
*/
module.exports = Model;