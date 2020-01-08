/*
 * @Description: 文章模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-01 16:20:33
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-01-08 00:50:43
 */

const autoIncrement = require("mongoose-auto-increment");
const autopopulate = require('mongoose-autopopulate');
const mongoose = require("mongoose");
const DB = require("./db");
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let ArticleSchema = new Schema({
  id: {
    type: Number,
    ref: "id"
  },
  title: String,
  desc: String,
  banner: String,
  tag: {
    type: [String]
  },
  content: String,
  catg: String,
  // 访问数
  pv: {
    type: Number,
    default: 0
  },
  // 评论数组
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment',
    autopopulate: { select: '-_id-__v', options: { sort: { id: -1 } } }
  }],
  // 评论数
  cmt_count: {
    type: Number,
    default: 0
  },
  // 点赞数
  like: {
    type: Number,
    default: 0
  },
  cdate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    default: 1
  }
});

ArticleSchema.plugin(autopopulate);
ArticleSchema.plugin(autoIncrement.plugin, {
  model: "article",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("article", ArticleSchema);