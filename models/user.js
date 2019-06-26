/*
 * @Description: 用户模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-12 17:35:08
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-06-26 23:09:29
 */

const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");
const DB = require("./db");
const Schema = mongoose.Schema;

let CountersSchema = new Schema({
  name: String
});

let UserSchema = new Schema({
  id: {
    type: Number,
    ref: "id"
  },
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
  intro: {
    type: String
  },
  email: {
    type: String
  }
});

UserSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "id",
  startAt: 1,
  incrementBy: 1
});
CountersSchema.plugin(autoIncrement.plugin, "id");
module.exports = DB.model("user", UserSchema);
