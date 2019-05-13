const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

let catgSchema = new Schema({
  id: ObjectId,
  categoryname: String,
  categorydesc: String,
  cdate: {
    type: Date,
    default: Date.now
  }
})

module.exports = DB.model('category', catgSchema)