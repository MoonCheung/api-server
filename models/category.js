/*
 * @Description: 文章分类模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-12 14:53:21
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-05-26 00:13:18
 */

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