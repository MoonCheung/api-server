/*
 * @Description: 评论模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 23:38:34
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-12-30 22:03:24
 */

const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");
const DB = require("./db");
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let CommentSchema = new Schema({
  id: {
    type: Number,
    ref: "id"
  },
  artId: Number,
  from_user: {
    type: String,
    required: true
  },
  from_email: {
    type: String,
    required: true
  },
  from_webSite: String,
  from_avatar: String,
  from_content: {
    type: String,
    required: true
  },
  // IP地址
  from_ip: {
    type: String
  },
  // IP物理地址
  from_locate: {
    type: Object,
  },
  // 用户代理解析器
  from_ua: String,
  from_date: {
    type: Date,
    default: Date.now
  },
  to_user: String,
  to_email: String,
  to_webSite: String,
  to_avatar: String,
  to_content: String,
  // IP物理地址
  to_locate: {
    type: Object
  },
  // 用户代理解析器
  to_ua: String,
  to_date: Date,
  // 点赞数
  like: {
    type: Number,
    default: 0
  }
});

CommentSchema.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("comment", CommentSchema);