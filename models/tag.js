/*
 * @Description: 文章标签模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-12 14:58:15
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-05-26 00:14:11
 */

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

module.exports = DB.model('tab', tabSchema) // 尴尬！准备上线之前tab改成为tag