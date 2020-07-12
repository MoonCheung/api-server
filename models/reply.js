/*
 * @Description: 回复模型
 * @Author: MoonCheung
 * @Date: 2020-01-02 16:45:08
 * @Github: https://github.com/MoonCheung
 */

const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const DB = require('./db');
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let ReplySchema = new Schema({
  // 父评论id
  comment_id: {
    type: Number,
    ref: 'comment'
  },
  // 主键id
  id: {
    type: Number,
    ref: 'id'
  },
  // 评论者用户
  from_user: String,
  // 评论者邮箱
  from_email: String,
  // 评论者站点
  from_webSite: String,
  // 评论者头像
  from_avatar: String,
  // 评论者内容
  from_content: String,
  // IP物理地址
  from_locate: {
    type: Object
  },
  // 用户代理解析器
  from_ua: String,
  // 评论者时间
  from_date: {
    type: Date,
    default: Date.now
  },
  // 点赞数
  like: {
    type: Number,
    default: 0
  },
  // 被评论者id
  to_id: {
    type: Number,
    default: null
  },
  // 被评论者昵称
  to_user: {
    type: String,
    default: ''
  },
  // 被评论者邮箱
  to_email: {
    type: String,
    default: ''
  }
});

ReplySchema.plugin(autoIncrement.plugin, {
  model: 'reply',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, 'id');
module.exports = DB.model('reply', ReplySchema);
