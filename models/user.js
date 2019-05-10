const mongoose = require('mongoose')
const DB = require('./db')
const Schema = mongoose.Schema

let UserSchema = new Schema({
  username: {
    type: String,
    required: true, // 表示该字段是必需的
    unique: true // 表示该字段唯一
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String]
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  introduction: {
    type: String
  },
})

module.exports = DB.model('user', UserSchema)