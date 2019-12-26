/*
 * @Description: 文章标签模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-12 14:58:15
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-12-09 21:21:34
 */
const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");
const DB = require("./db");
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let tabSchema = new Schema({
  id: {
    type: Number,
    ref: "id"
  },
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
});

tabSchema.plugin(autoIncrement.plugin, {
  model: "tag",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("tag", tabSchema);