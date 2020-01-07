/*
 * @Description: 评论模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 23:38:34
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-01-08 00:19:21
 */

const autoIncrement = require('mongoose-auto-increment');
const autopopulate = require('mongoose-autopopulate');
const mongoose = require('mongoose');
const DB = require('./db');
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String,
});

let CommentSchema = new Schema({
  // 主键
  id: {
    type: Number,
    ref: 'id',
  },
  // 单一文章ID
  artId: {
    type: Number,
    ref: 'article'
  },
  from_user: {
    type: String,
    required: true,
  },
  from_email: {
    type: String,
    required: true,
  },
  from_webSite: String,
  from_avatar: String,
  from_content: {
    type: String,
    required: true,
  },
  // IP地址
  from_ip: {
    type: String,
  },
  // IP物理地址
  from_locate: {
    type: Object,
  },
  // 用户代理解析器
  from_ua: String,
  from_date: {
    type: Date,
    default: Date.now,
  },
  // 子评论数组
  replys: [{
    type: Schema.Types.ObjectId,
    ref: 'reply',
    autopopulate: { select: '-_id-__v' }
  }],
  // 回复数
  reply_count: {
    type: Number,
    default: 0
  },
  // 点赞数
  like: {
    type: Number,
    default: 0,
  },
});

CommentSchema.plugin(autopopulate);
CommentSchema.plugin(autoIncrement.plugin, {
  model: 'comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});
CountersSchema.plugin(autoIncrement.plugin, 'id');
module.exports = DB.model('comment', CommentSchema);