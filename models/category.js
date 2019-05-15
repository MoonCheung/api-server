const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let catgSchema = new Schema({
  categoryname: String,
  categorydesc: String,
  cdate: {
    type: Date,
    default: Date.now
  }
})

module.exports = DB.model('category', catgSchema)