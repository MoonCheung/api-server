const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

let tabSchema = new Schema({
  id: ObjectId,
  tagname: String,
  tagdesc: String,
  cdate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    default: 1
  }
})

module.exports = DB.model('tab', tabSchema)