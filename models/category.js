/*
 * @Description: 文章分类模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-12 14:53:21
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-06-05 15:33:51
 */

const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");
const DB = require("./db");
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let catgSchema = new Schema({
  id: {
    type: Number,
    ref: "id"
  },
  categoryname: String,
  categorydesc: String,
  cdate: {
    type: Date,
    default: Date.now
  }
});

catgSchema.plugin(autoIncrement.plugin, {
  model: "category",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("category", catgSchema);
