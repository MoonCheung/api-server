const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let CountersSchema = new Schema({
  name: String
});

let ArticleSchema = new Schema({
  id: {
    type: Number,
    ref: 'id'
  },
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

ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})
CountersSchema.plugin(autoIncrement.plugin, 'id');
module.exports = DB.model('article', ArticleSchema)