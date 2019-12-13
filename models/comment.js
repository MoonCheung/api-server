/*
 * @Description: 评论模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-12-12 23:38:34
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-12-13 00:44:09
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
  content: String,
  oldContent: String,
  from_user: String,
  from_email: String,
  from_weblink: String,
  from_avatar: String,
  to_user: String,
  to_email: String,
  to_weblink: String,
  to_avatar: String,
  cdate: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("comment", ArticleSchema);