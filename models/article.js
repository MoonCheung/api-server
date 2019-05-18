const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let ArticleSchema = new Schema({
  title: String,
  desc: String,
  banner: String,
  tag: {
    type: [String]
  },
  content: String,
  catg: String,
  cdate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    default: 1
  }
})

module.exports = DB.model('article', ArticleSchema)