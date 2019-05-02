const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let frontArticleSchema = new Schema({
  title: String,
  time: String,
  content: String,
  des: String,
  list: String,
  banner: String,
  imgFileName: String,
  comment: []
})

module.exports = DB.model('frontArticle', frontArticleSchema)