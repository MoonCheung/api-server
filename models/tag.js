const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let tabSchema = new Schema({
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